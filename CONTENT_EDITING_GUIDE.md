# Content Editing Guide

## How to Edit Website Content Without Touching Code

This guide will show you how to update text and partner links on your website by simply editing a JSON file through GitHub's web interface. **No coding experience required!**

---

## Overview

All the text content shown in the website's info panel is stored in a file called `content.json`. When you edit this file and commit the changes, your website will automatically update after deployment.

**File Location:** `public/content.json`

---

## Step-by-Step Instructions

### Step 1: Navigate to the GitHub Repository

1. Go to your GitHub repository in your web browser
2. Make sure you're logged in with an account that has editing permissions

### Step 2: Find the Content File

1. In the repository, navigate to the `public` folder
2. Find and click on the file named `content.json`

### Step 3: Edit the File

1. Click the **pencil icon** (✏️) in the top right corner of the file view to edit it
2. The file will open in edit mode

### Step 4: Make Your Changes

The file has two main sections:

#### **Section A: Introduction Text** (`intro`)

Here you can edit:
- **`title`** - The main heading (e.g., "General Strike 100")
- **`paragraph1`** - First paragraph of introduction text
- **`paragraph2`** - Second paragraph of introduction text
- **`partnershipText`** - Text about the partnership
- **`passportText`** - Text about the printed passport program
- **`donationText`** - Text before the donation link
- **`donationLink`** - The donation URL (e.g., "https://bit.ly/GeneralStrike100")
- **`donationLinkText`** - The clickable text for the donation link (e.g., "click here")
- **`contactText`** - Text before the contact email
- **`contactEmail`** - The contact email address
- **`searchText`** - Instructions about using the search box

**Example:**
```json
"intro": {
  "title": "General Strike 100",
  "paragraph1": "Your text here...",
  "paragraph2": "More text here...",
  ...
}
```

#### **Section B: Partners List** (`partners`)

This is an array of partner organizations. Each partner has:
- **`name`** - The organization name (e.g., "People's History Museum")
- **`url`** - The website URL (e.g., "https://phm.org.uk/")

**To add a new partner:**
1. Find the partners array (it starts with `"partners": [`)
2. After the last partner entry (before the closing `]`), add a comma and a new entry like this:

```json
{
  "name": "Organization Name",
  "url": "https://www.example.com/"
}
```

**Example - Adding a new partner:**
```json
"partners": [
  {
    "name": "Existing Partner",
    "url": "https://existing.org/"
  },
  {
    "name": "New Partner Name",
    "url": "https://newpartner.org/"
  }
]
```

**To remove a partner:**
- Delete the entire partner entry including its comma (make sure there's no trailing comma after the last item)

**To edit a partner:**
- Simply change the `name` or `url` value

### Step 5: Important Editing Rules

⚠️ **When editing JSON files, follow these rules:**

1. **Always use double quotes** (`"`) for text, not single quotes (`'`)
2. **Always end items with commas** (except the last item in a list)
3. **Don't forget commas** between items in arrays
4. **Keep the JSON structure intact** - don't remove curly braces `{}` or square brackets `[]`
5. **Make sure all opening brackets have closing brackets**

**Common Mistakes to Avoid:**
- ❌ Missing commas between items
- ❌ Using single quotes instead of double quotes
- ❌ Removing brackets or braces
- ❌ Trailing commas after the last item in an array

### Step 6: Preview Your Changes

1. Scroll to the bottom of the edit page
2. Click the **"Preview"** tab to see how your changes look
3. Check for any syntax errors (highlighted in red)

### Step 7: Commit Your Changes

1. At the bottom of the page, you'll see a **"Commit changes"** section
2. In the **"Commit message"** field, enter a brief description of your changes
   - Example: "Update contact email address"
   - Example: "Add new partner organization"
   - Example: "Update donation link text"
3. Optionally add a more detailed description in the extended description box
4. Make sure **"Commit directly to the main branch"** is selected (or choose your branch if working on a different one)
5. Click the green **"Commit changes"** button

### Step 8: Wait for Deployment

- After you commit, your changes will be automatically deployed to the website
- This usually takes a few minutes
- You can check your site after a few minutes to see the updates

---

## Examples

### Example 1: Changing the Title

**Before:**
```json
"title": "General Strike 100",
```

**After:**
```json
"title": "General Strike Centenary",
```

### Example 2: Updating a Link

**Before:**
```json
"donationLink": "https://bit.ly/GeneralStrike100",
```

**After:**
```json
"donationLink": "https://bit.ly/NewDonationLink",
```

### Example 3: Adding a New Partner

Find the partners array and add:
```json
{
  "name": "New Organization Name",
  "url": "https://www.neworganization.org/"
}
```

Make sure to:
- Add a comma after the previous partner entry
- Add the new entry before the closing `]`

---

## File Structure Reference

```json
{
  "intro": {
    "title": "...",
    "paragraph1": "...",
    "paragraph2": "...",
    "partnershipText": "...",
    "passportText": "...",
    "donationText": "...",
    "donationLink": "...",
    "donationLinkText": "...",
    "contactText": "...",
    "contactEmail": "...",
    "searchText": "..."
  },
  "partners": [
    {
      "name": "Partner 1",
      "url": "https://..."
    },
    {
      "name": "Partner 2",
      "url": "https://..."
    }
  ]
}
```

---

## Troubleshooting

### The file won't save or shows an error

- **Check for syntax errors**: Make sure all quotes are double quotes, all commas are in place, and all brackets are closed
- **Use the Preview tab**: This will show you where errors are
- **Common fix**: Validate your JSON using an online JSON validator like [jsonlint.com](https://jsonlint.com)

### Changes aren't showing on the website

- Wait a few minutes for the deployment to complete
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check if the deployment was successful in your GitHub repository

### Need to restore previous content

1. Go to the `content.json` file on GitHub
2. Click "History" to see previous versions
3. Find the version you want to restore
4. Copy the content and paste it into the current file

---

## Need Help?

If you encounter any issues:
1. Double-check the JSON syntax
2. Use the Preview function to catch errors before committing
3. Contact your web developer if the issue persists

---

## Quick Checklist

Before committing, make sure:
- [ ] All text is wrapped in double quotes
- [ ] All commas are in place (except after the last item)
- [ ] All brackets `{}` and `[]` are properly closed
- [ ] No trailing commas after the last item
- [ ] Preview shows no errors
- [ ] Commit message is descriptive

---

**Remember:** You can always preview your changes before committing, and GitHub keeps a history of all changes, so you can revert if needed!

