import { Helmet } from 'react-helmet-async';
import { COMPANY } from '@/utils/constants';

export default function SEOMeta({ title, description, image }) {
  const fullTitle = title ? `${title} | ${COMPANY.name}` : COMPANY.name;
  const desc = description || `${COMPANY.name} - ${COMPANY.tagline}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}