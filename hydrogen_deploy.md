# Hydrogen Deployment Checklist

## Pre-Deployment Checks
- [ ] Node.js version is 18.0.0 or higher
- [ ] All dependencies are installed (`npm install`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All environment variables are set in `.env`
- [ ] All Weaverse components are properly configured
- [ ] Local development server runs without errors (`npm run dev`)

## Environment Variables Setup
- [ ] Create `.env` file with required variables:
  ```env
  PUBLIC_STORE_DOMAIN=your-store.myshopify.com
  PUBLIC_STOREFRONT_API_TOKEN=your_storefront_api_token
  PUBLIC_STOREFRONT_ID=your_storefront_id
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_customer_account_api_client_id
  PUBLIC_CUSTOMER_ACCOUNT_API_URL=your_customer_account_api_url
  ```

## Build Process
- [ ] Run production build: `npm run build`
- [ ] Verify build output in `dist/` directory
- [ ] Test production build locally: `npm run preview`
- [ ] Check console for any errors or warnings

## Shopify CLI Setup
- [ ] Latest Shopify CLI installed: `npm install -g @shopify/cli @shopify/hydrogen`
- [ ] Logged into Shopify CLI: `shopify auth login`
- [ ] Hydrogen project linked to Shopify store
- [ ] Oxygen service enabled in Shopify admin

## Deployment to Oxygen
- [ ] Run deployment command: `shopify hydrogen deploy`
- [ ] Note down the Oxygen URL provided after deployment
- [ ] Verify deployment status in Shopify admin
- [ ] Check deployment logs for any issues

## Domain Configuration
- [ ] Access Shopify admin > Settings > Domains
- [ ] Add custom domain
- [ ] Configure DNS records:
  - [ ] Add A records
  - [ ] Add CNAME records
  - [ ] Wait for DNS propagation (up to 48 hours)
- [ ] SSL certificate provisioned and active
- [ ] Domain status shows as "Active"

## Market Configuration
- [ ] Go to Settings > Markets
- [ ] Set primary domain
- [ ] Configure market regions:
  - [ ] Currency settings
  - [ ] Language settings
  - [ ] Shipping zones
  - [ ] Tax settings

## Post-Deployment Testing
### Functionality
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Search functionality works
- [ ] Cart operations work:
  - [ ] Add to cart
  - [ ] Remove from cart
  - [ ] Update quantities
- [ ] Checkout process works
- [ ] Customer account functions:
  - [ ] Login
  - [ ] Registration
  - [ ] Password reset
  - [ ] Order history

### Weaverse Components
- [ ] All sections render correctly
- [ ] Dynamic content loads properly
- [ ] Custom components function as expected
- [ ] Theme settings are applied correctly

### Performance
- [ ] Run Lighthouse test
- [ ] Check page load times
- [ ] Verify image optimization
- [ ] Test mobile performance
- [ ] Check Core Web Vitals

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Mobile Responsiveness
- [ ] Test on different screen sizes
- [ ] Check navigation on mobile
- [ ] Verify touch interactions
- [ ] Test mobile-specific features

## Analytics & Tracking
- [ ] Google Analytics connected
- [ ] Google Tag Manager setup (if used)
- [ ] Facebook Pixel configured (if used)
- [ ] Shopify analytics enabled
- [ ] Custom event tracking verified

## SEO Setup
- [ ] Meta titles and descriptions
- [ ] Canonical URLs configured
- [ ] robots.txt properly set
- [ ] Sitemap.xml accessible
- [ ] Google Search Console verified
- [ ] Structured data implemented

## Security
- [ ] SSL/HTTPS working
- [ ] Content Security Policy configured
- [ ] API keys and tokens secured
- [ ] Customer data encryption verified
- [ ] Payment gateway security checked

## Backup & Recovery
- [ ] Code repository backed up
- [ ] Database backups configured
- [ ] Recovery process documented
- [ ] Emergency contacts listed

## Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Custom features documented
- [ ] Maintenance procedures written
- [ ] Contact information updated

## Final Checks
- [ ] All checklist items completed
- [ ] Team notified of deployment
- [ ] Monitoring tools set up
- [ ] Support channels ready
- [ ] Launch announcement prepared

## Emergency Contacts
- Technical Support: andreas@ribban.co
- Shopify Support: https://help.shopify.com
- Weaverse Support: https://weaverse.io/support

## Rollback Plan
1. [ ] Previous version tagged in repository
2. [ ] Rollback commands documented
3. [ ] Database restore process tested
4. [ ] Team trained on rollback procedures

Remember to save this checklist for future deployments and keep it updated with any new requirements or lessons learned. 