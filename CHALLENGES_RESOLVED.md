# CodeBloggs Project - Challenges Encountered & Resolutions

## Challenge 1: Font Family Inconsistency Across Pages
### Problem
Different font families were being used across the application. Interior pages displayed different fonts than intended, creating inconsistency in the user interface.

### Resolution
- Added Google Fonts import for Open Sans in `client/src/index.css`
- Applied Open Sans globally to the body element with multiple font weights (300, 400, 600, 700, 800)
- Ensured consistency across all pages by setting the font-family at the root level

### Code Solution
```css
@import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
}
```

---

## Challenge 2: Layout Structure Issues
### Problem
The sidebar, header, and main content area were not properly aligned. The sidebar didn't extend to the top, the header spanned the full width, and positioning was inconsistent across pages.

### Sub-challenges & Resolutions

#### 2a. Sidebar Not Extending to Top
**Problem:** Sidebar had `top: 80px` and `height: calc(100vh - 80px)`, leaving a gap at the top

**Resolution:** Changed to `top: 0` and `height: 100vh` to extend full height

#### 2b. Header Spanning Full Width
**Problem:** Header's `left: 0` caused it to overlap the sidebar

**Resolution:** Changed `left: 0` to `left: 250px` (sidebar width) so it starts after the sidebar

#### 2c. Main Content Area Positioning
**Problem:** Content wasn't accounting for the sidebar and header spacing

**Resolution:** Added `marginLeft: 250px` and `marginTop: 95px` to account for both sidebar and header

#### 2d. Logo Placement Issues
**Problem:** Logo needed to be:
- Centered in the sidebar
- Positioned at a specific height
- Aligned with the dividing line below it

**Resolution:** 
- Used flexbox with justify-content and align-items for centering
- Applied negative left margin (`marginLeft: -20px`) for horizontal adjustment
- Final header height set to 95px to align with logo section divider

---

## Challenge 3: Sidebar Button Styling
### Problem
Navigation buttons needed to be:
- Rounded appearance
- Centered within the sidebar
- Display with icons
- Have active state styling with outline

### Sub-challenges & Resolutions

#### 3a. Adding Icons to Buttons
**Problem:** No icons were available for navigation items

**Resolution:**
- Installed `react-icons` library
- Imported specific icons: `AiOutlineHome`, `MdArticle`, `FaUsers`, `MdAdminPanelSettings`
- Added icon components to each nav item with 20px size

#### 3b. Rounding and Centering Buttons
**Problem:** Buttons had a left border accent and weren't properly centered

**Resolution:**
- Changed `borderRadius` from 0 to 16px for rounded corners
- Replaced left border styling with side margins (`marginLeft: 1.3rem`, `marginRight: 1.3rem`)
- This reduced button width by 10% and centered them

#### 3c. Button Spacing
**Problem:** Buttons needed specific padding

**Resolution:**
- Set left padding to 40px for proper icon/text spacing
- Added top margin of 40px to nav container to offset from logo

#### 3d. Active State Styling
**Problem:** Active button needed visual distinction

**Resolution:**
- Added 2px solid border with purple color (#8D88EA) on active state
- Maintained white background and purple text for active items

---

## Challenge 4: Git Branch Management & Merge Conflicts
### Problem
Multiple issues emerged when working with git branches and pushing changes

### Sub-challenges & Resolutions

#### 4a. Wrong Project Folder
**Problem:** User was running git commands in the `FullStackDev2-MERN` project folder instead of `CodeBloggs`

**Resolution:**
- Navigated to the correct directory: `cd /home/avaspop/Projects/CodeBloggs`
- Emphasized importance of checking current working directory before git operations

#### 4b. Branch Doesn't Exist Locally
**Problem:** Created `layout-feat` branch on GitHub but it wasn't available locally

**Resolution:**
```bash
git fetch                          # Fetch all remote branches
git switch --track origin/layout-feat  # Switch to the remote branch
```

#### 4c. Divergent Branches Preventing Pull
**Problem:** Remote `dev` branch had commits not in local version, preventing pull/push

**Error Message:**
```
Updates were rejected because the remote contains work that you do 
not have locally. Need to specify how to reconcile divergent branches.
```

**Resolution:**
```bash
git pull origin dev --no-rebase  # Merged remote changes locally
```

#### 4d. Merge Conflict in Sidebar.jsx
**Problem:** Pull resulted in merge conflict in `client/src/components/Sidebar.jsx`

**Resolution:**
- Opened the file and manually resolved conflict markers (<<<<<<, ======, >>>>>>)
- Kept desired changes and removed conflict markers
- Staged and committed the resolved file:
```bash
git add client/src/components/Sidebar.jsx
git commit -m "Merge dev branch"
```

#### 4e. Push Rejected - Non-Fast-Forward
**Problem:** Push failed with "non-fast-forward" error

**Error:**
```
Updates were rejected because a pushed branch tip is behind its 
remote counterpart.
```

**Resolution:**
```bash
git push origin dev --force-with-lease
```
Used `--force-with-lease` instead of `--force` for safer force push

#### 4f. Unpushed Commits Detection
**Problem:** Needed to identify if changes were pushed to remote

**Resolution:**
```bash
git status                    # Quick check for unpushed commits
git log origin/branch..branch --oneline  # See unpushed commits
```

---

## Challenge 5: API Documentation Organization
### Problem
Had 20+ API endpoints but they weren't organized by page/feature

### Resolution
Created `WIREFRAME_ANALYSIS.md` organized by page/wireframe:
- Login Page
- Registration Page
- Main Page (Home with Post Modal & Logout)
- Blogs Page
- Network Page
- Admin Page

Each section listed only relevant endpoints for that page, making it easier to understand dependencies and development requirements.

---

## Summary of Key Learning Points

1. **Font Management:** Use global CSS imports for consistency
2. **Layout Positioning:** Plan z-index, positioning, and spacing carefully when using fixed elements
3. **Icon Libraries:** react-icons provides lightweight, tree-shakeable icon options
4. **Git Workflow:** Always check working directory before running git commands
5. **Merge Conflicts:** Understand how to identify and resolve conflict markers
6. **Force Push:** Use `--force-with-lease` over `--force` for safety
7. **API Organization:** Group endpoints by feature/page for better clarity

---

## Files Modified
- `client/src/index.css` - Font imports
- `client/src/components/Header.jsx` - Layout positioning
- `client/src/components/Sidebar.jsx` - Layout, styling, icons
- `client/src/layouts/AppLayout.jsx` - Content area positioning
- `WIREFRAME_ANALYSIS.md` - API documentation

## Dependencies Added
- `react-icons` - Icon library for navigation buttons
