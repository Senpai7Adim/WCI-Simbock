import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;
const SITE_URL = 'https://wci-simbock.vercel.app';
const LOGO_URL = 'https://faithtabernacle.org.ng/vendor/images/lfw_.png';
const BRAND_RED = '#E3000F';
const CHURCH_NAME = 'Winners Chapel International Simbock';

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr>
    <td style="background:linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 100%);padding:36px 40px;text-align:center;">
      <img src="${LOGO_URL}" alt="${CHURCH_NAME}" width="72" height="72"
           style="border-radius:50%;border:3px solid ${BRAND_RED};object-fit:cover;display:block;margin:0 auto 16px;"/>
      <p style="margin:0;color:#ffffff;font-size:13px;letter-spacing:3px;text-transform:uppercase;font-weight:500;">${CHURCH_NAME}</p>
    </td>
  </tr>
  ${content}
  <tr>
    <td style="background:#1a1a1a;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 8px;color:#aaaaaa;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Winners Chapel International Simbock</p>
      <p style="margin:0;color:#666666;font-size:11px;">Simbock, Yaoundé, Cameroon &nbsp;|&nbsp;
        <a href="${SITE_URL}" style="color:${BRAND_RED};text-decoration:none;">Visit our Website</a>
      </p>
      <p style="margin:16px 0 0;color:#444444;font-size:10px;">You received this email because you are a member of WCI Simbock.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function ctaButton(label: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px auto 0;">
    <tr><td style="background:${BRAND_RED};border-radius:8px;padding:14px 32px;">
      <a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">${label}</a>
    </td></tr>
  </table>`;
}

function divider(): string {
  return `<tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,${BRAND_RED},transparent);"></div></td></tr>`;
}

export function welcomeEmailHtml(displayName: string): string {
  const content = `
    <tr><td style="padding:48px 40px 8px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🙏</div>
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:28px;font-weight:700;font-family:Georgia,serif;">Welcome to the Family!</h1>
      <p style="margin:0;color:${BRAND_RED};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:500;">God Has a Plan for You</p>
    </td></tr>
    ${divider()}
    <tr><td style="padding:32px 40px;">
      <p style="margin:0 0 16px;color:#333;font-size:16px;line-height:1.7;">Dear <strong>${displayName}</strong>,</p>
      <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.8;">We are overjoyed to welcome you to <strong>Winners Chapel International Simbock</strong>! Your journey with us begins today, and we believe great things are in store for you.</p>
      <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.8;">At WCI Simbock, we are a community built on faith, love, and the unshakeable Word of God. Whether you are seeking spiritual growth, community, or simply a place to belong — <strong>you have found your home.</strong></p>
      <blockquote style="margin:24px 0;padding:20px 24px;background:#fafafa;border-left:4px solid ${BRAND_RED};border-radius:0 8px 8px 0;">
        <p style="margin:0;color:#444;font-size:15px;line-height:1.7;font-style:italic;">"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."</p>
        <p style="margin:8px 0 0;color:${BRAND_RED};font-size:13px;font-weight:600;">— Jeremiah 29:11</p>
      </blockquote>
      <ul style="margin:0 0 24px;padding-left:20px;color:#555;font-size:15px;line-height:2;">
        <li>Inspiring <strong>Sunday Services</strong> filled with the Word of God</li>
        <li>Powerful <strong>testimonies</strong> from our faith community</li>
        <li>Upcoming <strong>events</strong> to grow and connect</li>
        <li>A family that <strong>prays and grows together</strong></li>
      </ul>
      ${ctaButton('Explore Our Website', SITE_URL)}
    </td></tr>
    <tr><td style="padding:0 40px 40px;text-align:center;">
      <p style="margin:32px 0 0;color:#888;font-size:13px;line-height:1.6;">We look forward to seeing you at our next service. God bless you!</p>
      <p style="margin:8px 0 0;color:#555;font-size:14px;font-weight:600;">— The WCI Simbock Family</p>
    </td></tr>`;
  return emailWrapper(content);
}

export function eventEmailHtml(eventDate: string, eventText: string, eventImg?: string): string {
  const imgBlock = eventImg
    ? `<tr><td style="padding:0 40px 24px;"><img src="${eventImg}" alt="Event" width="520" style="width:100%;max-width:520px;border-radius:12px;object-fit:cover;display:block;"/></td></tr>`
    : '';
  const content = `
    <tr><td style="padding:48px 40px 8px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">📅</div>
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:26px;font-weight:700;font-family:Georgia,serif;">New Event at WCI Simbock</h1>
      <p style="margin:0;color:${BRAND_RED};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:500;">Mark Your Calendar</p>
    </td></tr>
    ${divider()}
    <tr><td style="padding:32px 40px 16px;">
      <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.8;">A new event has been added to our church calendar. We warmly invite you to join us!</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-radius:12px;border:1px solid #eee;overflow:hidden;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;background:${BRAND_RED};">
          <p style="margin:0;color:#fff;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Event Date</p>
          <p style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">${eventDate}</p>
        </td></tr>
        <tr><td style="padding:20px 24px;">
          <p style="margin:0;color:#333;font-size:15px;line-height:1.8;">${eventText}</p>
        </td></tr>
      </table>
    </td></tr>
    ${imgBlock}
    <tr><td style="padding:0 40px 40px;text-align:center;">
      ${ctaButton('View All Events', `${SITE_URL}/events`)}
      <p style="margin:24px 0 0;color:#888;font-size:13px;">We hope to see you there. God bless you!</p>
    </td></tr>`;
  return emailWrapper(content);
}

export function testimonyEmailHtml(title: string, name: string, text: string, img?: string): string {
  const imgBlock = img
    ? `<img src="${img}" alt="${name}" width="64" height="64" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid ${BRAND_RED};margin:0 auto 16px;display:block;"/>`
    : `<div style="font-size:40px;text-align:center;margin-bottom:16px;">✨</div>`;
  const shortText = text.length > 320 ? text.substring(0, 320) + '...' : text;
  const content = `
    <tr><td style="padding:48px 40px 8px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">✨</div>
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:26px;font-weight:700;font-family:Georgia,serif;">A New Testimony of God's Goodness</h1>
      <p style="margin:0;color:${BRAND_RED};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:500;">Share in the Joy</p>
    </td></tr>
    ${divider()}
    <tr><td style="padding:32px 40px;">
      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.8;">God is still performing miracles in our midst! A new testimony has been shared in our community.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #eee;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;text-align:center;">
          ${imgBlock}
          <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:18px;font-weight:700;font-family:Georgia,serif;">${title}</h2>
          <p style="margin:0 0 20px;color:${BRAND_RED};font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">By ${name}</p>
          <p style="margin:0;color:#555;font-size:15px;line-height:1.9;text-align:left;">${shortText}</p>
        </td></tr>
        <tr><td style="background:${BRAND_RED};padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#fff;font-size:13px;font-style:italic;">"Every good and perfect gift is from above." — James 1:17</p>
        </td></tr>
      </table>
      <div style="text-align:center;margin-top:24px;">
        ${ctaButton('Read Full Testimony', `${SITE_URL}/testimonies`)}
      </div>
      <p style="margin:24px 0 0;color:#888;font-size:13px;text-align:center;">Be encouraged today — God is faithful!</p>
    </td></tr>`;
  return emailWrapper(content);
}

export function contactEmailHtml(name: string, email: string, message: string): string {
  const content = `
    <tr><td style="padding:48px 40px 8px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">📩</div>
      <h1 style="margin:0 0 8px;color:#1a1a1a;font-size:26px;font-weight:700;font-family:Georgia,serif;">New Contact Message</h1>
      <p style="margin:0;color:${BRAND_RED};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:500;">WCI Simbock Website</p>
    </td></tr>
    ${divider()}
    <tr><td style="padding:32px 40px;">
      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.8;">You have received a new message from the contact form on the website.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border:1px solid #eee;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;color:#1a1a1a;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">From:</p>
          <p style="margin:0 0 20px;color:#555;font-size:16px;">${name} (<a href="mailto:${email}" style="color:${BRAND_RED};text-decoration:none;">${email}</a>)</p>
          
          <p style="margin:0 0 8px;color:#1a1a1a;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Message:</p>
          <p style="margin:0;color:#555;font-size:15px;line-height:1.9;white-space:pre-wrap;">${message}</p>
        </td></tr>
      </table>
      <div style="text-align:center;margin-top:24px;">
        ${ctaButton('Reply to Email', `mailto:${email}`)}
      </div>
    </td></tr>`;
  return emailWrapper(content);
}

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

export { EMAIL_USER, CHURCH_NAME };

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(404).json({ error: 'Not found' });
}
