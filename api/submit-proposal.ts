import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to generate proposal summary HTML
const generateProposalSummaryHTML = (summary: any) => {
  const { pricingPlan, leasePlan, maintenancePlan, addons, totals } = summary;
  let html = '';

  if (pricingPlan) {
    html += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${pricingPlan.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">One-time payment</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>${pricingPlan.price}</strong>
        </td>
      </tr>
    `;
  }

  if (leasePlan) {
    html += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${leasePlan.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Monthly lease</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>${leasePlan.price}</strong>
        </td>
      </tr>
    `;
  }

  if (maintenancePlan) {
    html += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${maintenancePlan.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Monthly maintenance</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>${maintenancePlan.price}</strong>
        </td>
      </tr>
    `;
  }

  if (addons && addons.length > 0) {
    addons.forEach((addon: any) => {
      html += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${addon.name}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Add-on</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <strong>${addon.price}</strong>
          </td>
        </tr>
      `;
    });
  }

  if (pricingPlan || leasePlan) {
    html += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>Required Hosting</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Non-negotiable monthly fee</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>$50/mo</strong>
        </td>
      </tr>
    `;
  }

  // Totals
  if (totals.oneTimeTotal > 0 || totals.monthlyTotal > 0) {
    html += `
      <tr>
        <td colspan="2" style="padding: 16px 12px; border-top: 2px solid #e5e7eb;">
          <table width="100%" style="border-collapse: collapse;">
            ${totals.oneTimeTotal > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">One-time Total</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formatCurrency(totals.oneTimeTotal)}</td>
              </tr>
            ` : ''}
            ${totals.monthlyTotal > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Monthly Recurring</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formatCurrency(totals.monthlyTotal)}/mo</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #6b7280;">Annual Recurring</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 600;">${formatCurrency(totals.annualTotal)}/yr</td>
              </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0 0 0; font-size: 18px; font-weight: 700; color: #111827;">Grand Total (First Year)</td>
              <td style="padding: 8px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #2EB14B;">${formatCurrency(totals.grandTotal)}</td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  return html || '<tr><td colspan="2" style="padding: 12px; color: #6b7280;">No items selected</td></tr>';
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      clientName, 
      contactName, 
      email, 
      phone, 
      notes, 
      proposalSummary,
      proposalId 
    } = req.body;

    // Validate required fields
    if (!clientName || !contactName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save submission to database if proposalId is provided
    let submissionId = null;
    if (proposalId) {
      try {
        const { data: submission, error: submissionError } = await supabaseAdmin
          .from('proposal_submissions')
          .insert({
            proposal_id: proposalId,
            contact_name: contactName,
            email: email,
            phone: phone || null,
            notes: notes || null,
          })
          .select()
          .single();

        if (!submissionError && submission) {
          submissionId = submission.id;

          // Update proposal status to 'accepted'
          await supabaseAdmin
            .from('proposals')
            .update({
              status: 'accepted',
              accepted_at: new Date().toISOString(),
            })
            .eq('id', proposalId);
        }
      } catch (dbError) {
        console.error('Error saving submission to database:', dbError);
        // Continue with email sending even if DB save fails
      }
    }

    // Email to your team
    const teamEmail = await resend.emails.send({
      from: 'Proposals <info@mail.barracudaseo.com>',
      to: ['dev@seosuccor.com'],
      subject: `New Proposal Accepted: ${clientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">New Proposal Accepted</h1>
                    </td>
                  </tr>
                  
                  <!-- Contact Information -->
                  <tr>
                    <td style="padding: 24px 32px;">
                      <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #111827;">Contact Information</h2>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; width: 140px;">Client:</td>
                          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${clientName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280;">Contact Name:</td>
                          <td style="padding: 8px 0; font-weight: 600; color: #111827;">${contactName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                          <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280;">Phone:</td>
                          <td style="padding: 8px 0; color: #111827;">${phone ? `<a href="tel:${phone.replace(/\D/g, '')}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${phone}</a>` : '<span style="color: #9ca3af;">Not provided</span>'}</td>
                        </tr>
                        ${notes ? `
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Notes:</td>
                          <td style="padding: 8px 0; color: #111827;">${notes.replace(/\n/g, '<br>')}</td>
                        </tr>
                        ` : ''}
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Proposal Summary -->
                  <tr>
                    <td style="padding: 0 32px 24px;">
                      <h2 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #111827;">Proposal Summary</h2>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
                        ${generateProposalSummaryHTML(proposalSummary)}
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
                      <p style="margin: 0;">This proposal was accepted through the SEO Succor proposal system.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    // Confirmation email to client
    const clientEmail = await resend.emails.send({
      from: 'SEO Succor <hello@seosuccor.com>',
      to: [email],
      subject: `Proposal Accepted - ${clientName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 32px 32px 24px; background: linear-gradient(135deg, #2EB14B 0%, #1A9AD6 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Thank You for Accepting Our Proposal!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px;">
                      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #111827;">Hi ${contactName},</p>
                      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #111827;">We've received your acceptance for the proposal for <strong>${clientName}</strong>. We're excited to work with you!</p>
                      
                      <div style="background-color: #f0fdf4; border-left: 4px solid #2EB14B; padding: 16px; margin: 24px 0; border-radius: 4px;">
                        <h3 style="margin: 0 0 12px; font-size: 18px; font-weight: 600; color: #111827;">What Happens Next?</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #111827;">
                          <li style="margin-bottom: 8px;">Our team will review your proposal details</li>
                          <li style="margin-bottom: 8px;">We'll reach out within 24-48 hours to schedule a kickoff call</li>
                          <li style="margin-bottom: 0;">We'll send over any necessary contracts or agreements</li>
                        </ul>
                      </div>
                      
                      <h2 style="margin: 32px 0 16px; font-size: 20px; font-weight: 600; color: #111827;">Your Proposal Summary</h2>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
                        ${generateProposalSummaryHTML(proposalSummary)}
                      </table>
                      
                      <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.6; color: #111827;">If you have any questions in the meantime, feel free to reach out!</p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 8px; font-weight: 600; color: #111827;">Best regards,</p>
                      <p style="margin: 0; color: #6b7280;">The SEO Succor Team</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Proposal accepted successfully',
      teamEmailId: teamEmail.data?.id,
      clientEmailId: clientEmail.data?.id
    });
  } catch (error: any) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ 
      error: 'Failed to send emails', 
      message: error.message 
    });
  }
}
