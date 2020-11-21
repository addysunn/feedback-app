const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  //constructor function will be called which can be used to do some initialization
  constructor({ subject, recipients }, content) {
    // to execute constructors defined in Mail class
    super();

    // passing keys to sendgid library, which returns an object to communicate to sendgrid APIs
    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('sunnyaditya48@gmail.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    //add objects to the Mailer to register it with the actual email
    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    //lecture 142, arrow function won't allow destructuring if we don't have () around { email }
    return recipients.map(({ email }) => {
      // take the email property and format it with sendgrid Email helper
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personalize = new helper.Personalization();

    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });
    this.addPersonalization(personalize);
  }

  //it will be asynchornous function so using async await
  async send() {
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
