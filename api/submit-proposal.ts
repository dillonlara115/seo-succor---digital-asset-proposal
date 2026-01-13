import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      proposalSummary 
    } = req.body;

    // Validate required fields
    if (!clientName || !contactName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email to your team
    const teamEmail = await resend.emails.send({
      from: 'Proposals <info@mail.barracudaseo.com>', // Update with your verified domain
      to: ['dev@seosuccor.com'], // Update with your email
      subject: `New Proposal Accepted: ${clientName}`,
      html: `
        <h2>New Proposal Accepted</h2>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Contact Name:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        
        <h3>Proposal Summary:</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${JSON.stringify(proposalSummary, null, 2)}</pre>
      `,
    });

    // Confirmation email to client
    const clientEmail = await resend.emails.send({
      from: 'SEO Succor <hello@seosuccor.com>', // Update with your verified domain
      to: [email],
      subject: `Proposal Accepted - ${clientName}`,
      html: `
        <h2>Thank You for Accepting Our Proposal!</h2>
        <p>Hi ${contactName},</p>
        <p>We've received your acceptance for the proposal for <strong>${clientName}</strong>.</p>
        
        <h3>What Happens Next?</h3>
        <ul>
          <li>Our team will review your proposal details</li>
          <li>We'll reach out within 24-48 hours to schedule a kickoff call</li>
          <li>We'll send over any necessary contracts or agreements</li>
        </ul>
        
        <h3>Proposal Summary:</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${JSON.stringify(proposalSummary, null, 2)}</pre>
        
        <p>If you have any questions in the meantime, feel free to reach out!</p>
        <p>Best regards,<br>The SEO Succor Team</p>
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
