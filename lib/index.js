var email = new (require('./emailer'))();

email.sendEmail('notifications@performance.service.gov.uk', 'email title', 'email body');
