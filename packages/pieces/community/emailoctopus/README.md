# EmailOctopus Piece

Email marketing platform integration for Activepieces focusing on list management, campaign sending, tagging & unsubscribes.

## Features

### Triggers
- **Email Bounced** - Fires when an email to a recipient bounces from a specific campaign
- **Email Opened** - Fires when a recipient opens an email from a specified campaign  
- **Email Clicked** - Fires when a link inside a specific campaign email is clicked
- **New Contact** - Fires when a new contact is added to a particular list
- **Contact Unsubscribes** - Fires when a contact unsubscribes from a list

### Actions
- **Add / Update Contact** - Adds a new contact to a list or updates an existing contact
- **Unsubscribe Contact** - Remove a contact from a list (unsubscribe)
- **Update Contact's Email Address** - Change the email address of a contact
- **Add Tag to Contact** - Add one or more tags to a contact in a specified list
- **Remove Tag from Contact** - Remove tag(s) from a contact in a list
- **Create List** - Creates a new list
- **Find Contact** - Look up a contact by email address within a given list

## Setup

1. Get your EmailOctopus API key from your account settings
2. Add the API key when connecting EmailOctopus in Activepieces
3. Select the list/campaign for your triggers and actions

## API Reference

- [EmailOctopus API Documentation](https://emailoctopus.com/api-documentation)

## Test Account

Sign up for free at [https://emailoctopus.com/](https://emailoctopus.com/)
