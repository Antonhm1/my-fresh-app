# Puppeteer MCP Server Test Scenarios

## Available Tools

### Browser Management
- `launch_browser` - Launch browser (headless/visible)
- `navigate` - Navigate to URL
- `close_browser` - Close browser
- `get_page_info` - Get current page info

### Element Interaction
- `click_element` - Click on elements
- `fill_input` - Fill input fields
- `get_text` - Extract text from elements
- `wait_for_element` - Wait for element to appear

### Testing & Debugging
- `take_screenshot` - Capture screenshots
- `evaluate_script` - Run JavaScript in browser

## Example Usage Scenarios

### 1. Basic App Testing
```
1. launch_browser(headless: false, url: "http://localhost:5173")
2. take_screenshot(filename: "homepage.png")
3. get_page_info()
```

### 2. Church Event Creation Flow
```
1. launch_browser(url: "http://localhost:5173")
2. click_element(selector: "[data-testid='login-button']")
3. fill_input(selector: "[data-testid='password-input']", value: "secretary-password")
4. click_element(selector: "[data-testid='login-submit']")
5. wait_for_element(selector: "[data-testid='edit-mode-indicator']")
6. click_element(selector: "[data-testid='add-event-button']")
7. fill_input(selector: "[data-testid='event-title']", value: "Test Event")
8. take_screenshot(filename: "event-creation.png")
```

### 3. Newsletter Signup Test
```
1. launch_browser(url: "http://localhost:5173")
2. wait_for_element(selector: "[data-testid='newsletter-popup']")
3. fill_input(selector: "[data-testid='email-input']", value: "test@example.com")
4. click_element(selector: "[data-testid='subscribe-button']")
5. wait_for_element(selector: "text=Tak for tilmelding")
6. take_screenshot(filename: "newsletter-success.png")
```

### 4. Mobile Responsive Testing
```
1. launch_browser(url: "http://localhost:5173")
2. evaluate_script(script: "window.resizeTo(375, 667)")
3. take_screenshot(filename: "mobile-view.png")
4. click_element(selector: "[data-testid='burger-menu']")
5. wait_for_element(selector: "[data-testid='mobile-menu']")
6. take_screenshot(filename: "mobile-menu.png")
```

### 5. Event Read More Functionality
```
1. launch_browser(url: "http://localhost:5173")
2. wait_for_element(selector: "[data-testid='event-card']")
3. take_screenshot(filename: "event-collapsed.png")
4. click_element(selector: "[data-testid='read-more']")
5. wait_for_element(selector: "[data-testid='expanded-description']")
6. take_screenshot(filename: "event-expanded.png")
```

## Debugging Commands

### Check Element Exists
```
get_text(selector: "h1")
```

### Run Custom JavaScript
```
evaluate_script(script: "document.querySelector('h1').textContent")
```

### Wait and Verify
```
wait_for_element(selector: ".loading", timeout: 10000)
```

## Configuration Notes

- Default URL: http://localhost:5173 (Vite dev server)
- Screenshots saved to: ./screenshots/
- Browser launches in visible mode by default for debugging
- Use data-testid selectors for stable element targeting
- Supports both CSS selectors and text-based selection