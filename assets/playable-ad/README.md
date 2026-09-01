# Flash Vocabulary Game Playable Ad

This directory contains a lightweight HTML5 playable ad for the Flash vocabulary game app. The playable ad is designed to showcase the core gameplay mechanic while maintaining a small file size for ad network delivery.

## Contents

- `index.html` - Main HTML structure
- `style.css` - Styling for the playable ad
- `main.js` - Game logic and functionality

## Business Value

This playable ad contributes directly to the Flash app's valuation by:

- Increasing user acquisition through interactive demonstration
- Reducing CAC (Customer Acquisition Cost) compared to traditional ads
- Demonstrating core functionality before download
- Supporting the "Next Steps to Increase Valuation" milestone of establishing initial user base

According to our latest valuation estimate, Flash has a pre-revenue valuation range of **$200,000 - $450,000**, with technical assets providing a significant portion of this value. This playable ad implementation helps move toward revenue generation goals by improving conversion rates from ad views to installs.

## Setup Instructions

1. **Update Store Links**:
   - Open `main.js`
   - Find the `detectPlatform()` function
   - Replace the placeholder URLs with your actual app store links:
     - App Store: `https://apps.apple.com/app/your-app-id`
     - Play Store: `https://play.google.com/store/apps/details?id=your.app.package`
     - Web fallback: `https://yourflashapp.com/download`

2. **Testing**:
   - Open `index.html` in a web browser to test functionality
   - Test on both desktop and mobile devices
   - Verify the CTA button correctly redirects to your app store links
   - Check that gameplay functions properly on touch devices

3. **Ad Network Submission**:
   - Compress the entire `playable-ad` folder into a ZIP file
   - Ensure the total size is under 1MB (current size is approximately 15KB)
   - Follow your ad network's specific requirements for HTML5 playable ad submission

## Performance Considerations

- The ad is designed to be lightweight with no external dependencies
- All animations use CSS for optimal performance
- Touch event handling is optimized for mobile devices
- The design is responsive and works on various screen sizes

## Customization Options

- Modify the questions in `main.js` to showcase different vocabulary words
- Adjust colors in `style.css` to match your brand guidelines
- Update the logo and messaging in `index.html` if needed

## Troubleshooting

- If the ad doesn't display correctly, check browser console for JavaScript errors
- For iOS WebView issues, ensure viewport settings are correct in `index.html`
- If redirect doesn't work, verify the app store URLs in `main.js`

## Ad Network Requirements

Different ad networks have specific requirements for playable ads:

- **Google Ads**: Requires HTTPS, no redirects during first 2 seconds
- **Facebook**: Max 2MB, must work in iframe
- **Unity Ads**: Requires specific meta tags for proper rendering
- **ironSource**: Prefer single HTML file with inline resources

Adjust your submission as needed for your target ad network.
