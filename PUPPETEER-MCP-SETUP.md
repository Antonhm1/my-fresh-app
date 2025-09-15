# Puppeteer MCP Server Setup Guide

## Overview
This setup provides a Puppeteer-based MCP server that allows Claude Desktop to control a browser and test your church web app UI interactively.

## ✅ What's Been Set Up

### 1. Dependencies Installed
- `puppeteer` - Browser automation
- `@modelcontextprotocol/sdk` - MCP server framework

### 2. MCP Server Created
- **File**: `mcp-server/puppeteer-server.js`
- **Capabilities**: Browser control, element interaction, screenshot capture
- **Tools**: 10+ browser automation tools

### 3. Configuration Files
- `claude_desktop_config.json` - Claude Desktop MCP configuration
- `mcp-server/test-scenarios.md` - Usage examples and test scenarios

## 🚀 How to Use

### Step 1: Configure Claude Desktop
1. **Copy the MCP configuration** to your Claude Desktop config:
   ```bash
   # macOS location
   cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Or manually add to your existing config:
   ```
   ```json
   {
     "mcpServers": {
       "puppeteer-ui-tester": {
         "command": "node",
         "args": ["./mcp-server/puppeteer-server.js"],
         "cwd": "/Users/Anton/my-app"
       }
     }
   }
   ```

### Step 2: Restart Claude Desktop
- Completely quit and restart Claude Desktop
- The MCP server should now be available

### Step 3: Start Your Dev Server
```bash
npm run dev
# App will be available at http://localhost:5173
```

### Step 4: Test with Claude
In Claude Desktop, you can now use these tools:

## 🛠️ Available Tools

### Browser Management
- `launch_browser` - Launch browser (visible/headless)
- `navigate` - Go to URLs
- `close_browser` - Close browser
- `get_page_info` - Get current page info

### Element Interaction
- `click_element` - Click buttons, links, etc.
- `fill_input` - Fill form fields
- `get_text` - Extract text content
- `wait_for_element` - Wait for elements to appear

### Testing & Debugging
- `take_screenshot` - Capture page screenshots
- `evaluate_script` - Run custom JavaScript

## 📝 Example Usage

### Basic App Testing
```
Could you launch the browser and take a screenshot of the homepage?

1. launch_browser(headless: false, url: "http://localhost:5173")
2. take_screenshot(filename: "homepage.png")
```

### Test User Flows
```
Test the event creation flow:

1. launch_browser(url: "http://localhost:5173")
2. click_element(selector: "button[data-testid='login-btn']")
3. fill_input(selector: "input[data-testid='password']", value: "test")
4. take_screenshot(filename: "after-login.png")
```

### Responsive Testing
```
Test mobile view:

1. launch_browser(url: "http://localhost:5173")
2. evaluate_script(script: "window.resizeTo(375, 667)")
3. take_screenshot(filename: "mobile.png")
```

## 🎯 Testing Scenarios for Church App

### 1. Event Management
- Create new events
- Edit existing events
- Test approval workflow
- Verify banner creation

### 2. Authentication Flow
- Secretary login
- User login
- Permission differences
- Session management

### 3. Newsletter Features
- Signup popup
- Email validation
- Subscription confirmation
- Unsubscribe flow

### 4. Multi-tenant Testing
- Different church configurations
- Isolated data verification
- Theme customization

### 5. Responsive Design
- Mobile menu functionality
- Event card layouts
- Touch interactions
- Viewport adaptations

## 📸 Screenshots
All screenshots are saved to `./screenshots/` directory:
- `homepage.png`
- `event-creation.png`
- `mobile-view.png`
- `newsletter-signup.png`
- etc.

## 🔧 Troubleshooting

### MCP Server Not Appearing
1. Check Claude Desktop config path
2. Restart Claude Desktop completely
3. Verify Node.js is in PATH
4. Check console for errors

### Browser Launch Issues
```bash
# Install Chrome/Chromium if needed
# macOS:
brew install chromium

# Or use headless mode:
launch_browser(headless: true)
```

### Element Selection Issues
- Use `data-testid` attributes for reliable selection
- Try different selector strategies:
  - CSS selectors: `button.primary`
  - Text selectors: `text=Click Here`
  - Data attributes: `[data-testid='submit-btn']`

## 🚀 Advanced Usage

### Custom JavaScript Execution
```javascript
// Get all event titles
evaluate_script(script: `
  Array.from(document.querySelectorAll('[data-testid="event-title"]'))
    .map(el => el.textContent)
`)
```

### Dynamic Waiting
```javascript
// Wait for specific conditions
evaluate_script(script: `
  new Promise(resolve => {
    const check = () => {
      if (document.querySelector('.loading').style.display === 'none') {
        resolve(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  })
`)
```

## 📋 Next Steps

1. **Configure Claude Desktop** with the MCP server
2. **Start testing** your church app UI flows
3. **Create test scenarios** for key features
4. **Automate repetitive testing** tasks
5. **Capture screenshots** for documentation

The MCP server is now ready to help you test and interact with your church web app UI through Claude Desktop! 🎉