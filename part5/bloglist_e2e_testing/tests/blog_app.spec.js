const { test, expect, beforeEach, before, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const testUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'test1234'
    }
    await request.post('http://localhost:3001/api/testing/')
    await request.post('http://localhost:3001/api/users', { data: testUser })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('test1234')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('testuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('testuser logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('testuser')
      await page.getByLabel('password').fill('test1234')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('A blog created by Playwright')
      await page.getByLabel('author').fill('Playwright Tester')
      await page.getByLabel('url').fill('http://example.com/playwright-blog')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator(".blog", {hasText: "A blog created by Playwright"})).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // Create a blog first
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('A blog to be liked')
      await page.getByLabel('author').fill('Playwright Tester')
      await page.getByLabel('url').fill('http://example.com/like-blog')
      await page.getByRole('button', { name: 'create' }).click()

      // Like the blog
      const blogEntry = page.locator(".blog", {hasText: "A blog to be liked"})
      // .locator('..')
      await blogEntry.getByRole('button', { name: 'view' }).click()
      await blogEntry.getByRole('button', { name: 'like' }).click()

      await expect(blogEntry.getByText('likes 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        await dialog.accept()
      })
      // Create a blog first
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('A blog to be deleted')
      await page.getByLabel('author').fill('Playwright Tester')
      await page.getByLabel('url').fill('http://example.com/delete-blog')
      await page.getByRole('button', { name: 'create' }).click()

      // Delete the blog
      const blogEntry = page.locator(".blog", {hasText: "A blog to be deleted"})
      await blogEntry.evaluate(el => console.log("BLOG ENTRY CONTENT", el.innerHTML))
      await blogEntry.getByRole('button', { name: 'view' }).click()
      await blogEntry.getByRole('button', { name: 'remove' }).click()

      const deletedBlog = page.locator(".blog", {hasText: "A blog to be deleted"})
      await deletedBlog.evaluate(el => console.log("DELETED BLOG CONTENT", el.innerHTML))
      await expect(page.locator(".blog", {hasText: "A blog to be deleted"})).not.toBeVisible()
    })

    describe('delete permission', () => {
      beforeEach(async ({ page, request }) => {
        // Create another user
        const anotherUser = {
          name: 'Another User',
          username: 'anotheruser',
          password: 'another1234'
        }
        await request.post('http://localhost:3001/api/users', { data: anotherUser })
      })

      test('only the owner can see the delete button', async ({ page, request }) => {
        // Create a blog first
        await page.getByRole('button', { name: 'add blog' }).click()
        await page.getByLabel('title').fill('A blog to test delete permission')
        await page.getByLabel('author').fill('Playwright Tester')
        await page.getByLabel('url').fill('http://example.com/delete-permission-blog')
        await page.getByRole('button', { name: 'create' }).click()

        // Logout current user
        await page.getByRole('button', { name: 'logout' }).click()

        // Login as another user
        await page.getByLabel('username').fill('anotheruser')
        await page.getByLabel('password').fill('another1234')
        await page.getByRole('button', { name: 'login' }).click()

        // Check that delete button is not visible
        const blogEntry = page.locator(".blog", {hasText: "A blog to test delete permission"})
        await blogEntry.getByRole('button', { name: 'view' }).click()
        await expect(blogEntry.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
    test.only('blogs are ordered by likes in descending order', async ({ page }) => {
      // Create first blog
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('First blog')
      await page.getByLabel('author').fill('Author One')
      await page.getByLabel('url').fill('http://example.com/first-blog')
      await page.getByRole('button', { name: 'create' }).click()

      // Create second blog
      await page.getByRole('button', { name: 'add blog' }).click()
      await page.getByLabel('title').fill('Second blog')
      await page.getByLabel('author').fill('Author Two')
      await page.getByLabel('url').fill('http://example.com/second-blog')
      await page.getByRole('button', { name: 'create' }).click()

      // Like second blog twice
      const secondBlogEntry = page.locator(".blog", {hasText: "Second blog"})
      await secondBlogEntry.getByRole('button', { name: 'view' }).click()
      const likeButton = secondBlogEntry.getByRole('button', { name: 'like' })
      await likeButton.click()
      await likeButton.click()

      // Like first blog once
      const firstBlogEntry = page.locator(".blog", {hasText: "First blog"})
      await firstBlogEntry.getByRole('button', { name: 'view' }).click()
      const firstLikeButton = firstBlogEntry.getByRole('button', { name: 'like' })
      await firstLikeButton.click()

      // Verify the order of blogs
      const blogEntries = page.locator('.blog')
      // const all = await blogEntries.allInnerTexts()
      // console.log("ALL BLOGS ORDER:", all)

      // await page.waitForFunction(() => {
      //   const blogs = [...document.querySelectorAll('.blog')]
      //   return blogs[0]?.innerText.includes('Second blog')
      // })

      // const firstEntryTitle = await blogEntries.nth(0).innerText()
      // const secondEntryTitle = await blogEntries.nth(1).innerText()

      // expect(firstEntryTitle).toContain('Second blog')
      // expect(secondEntryTitle).toContain('First blog')
      await expect(blogEntries.first()).toContainText('Second blog')
      await expect(blogEntries.nth(1)).toContainText('First blog')

    })
  })
})