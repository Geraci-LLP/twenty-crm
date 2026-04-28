import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { Link } from 'src/components/Link';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type PortalMagicLinkEmailProps = {
  magicLinkUrl: string;
  expiresInMinutes: number;
  recipientName?: string;
};

export const PortalMagicLinkEmail = ({
  magicLinkUrl,
  expiresInMinutes,
  recipientName,
}: PortalMagicLinkEmailProps) => {
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hi there,';

  return (
    <BaseEmail locale="en">
      <Title value="Sign in to the Geraci LLP Client Portal" />
      <MainText>
        <>
          {greeting}
          <br />
          <br />
          {`Use the button below to sign in to your Geraci LLP client portal. This link is valid for ${expiresInMinutes} minutes and can only be used once.`}
        </>
      </MainText>
      <br />
      <CallToAction href={magicLinkUrl} value="Sign in to the portal" />
      <br />
      <br />
      <MainText>
        <>
          If the button does not work, copy and paste this link into your
          browser:
          <br />
          <Link href={magicLinkUrl} value={magicLinkUrl} />
          <br />
          <br />
          If you did not request this link, you can safely ignore this email.
        </>
      </MainText>
    </BaseEmail>
  );
};

PortalMagicLinkEmail.PreviewProps = {
  magicLinkUrl: 'https://portal.geraci.example/auth/verify?token=abc123',
  expiresInMinutes: 15,
  recipientName: 'Jane',
} as PortalMagicLinkEmailProps;

export default PortalMagicLinkEmail;
