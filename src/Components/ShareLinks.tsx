import React from 'react';
import { Flex, IconButton, useClipboard } from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
type SocialNetwork = 'twitter' | 'facebook' | 'linkedin' | 'whatsapp';

interface ShareLinksProps {
  notaid: number;
}

const ShareLinks: React.FC<ShareLinksProps> = ({ notaid }) => {
  const { onCopy, hasCopied } = useClipboard(`${window.location.origin}/?notaid=${notaid}`);

  const shareOn = (network: SocialNetwork, url: string) => {
    const shareUrl: Record<SocialNetwork, string> = {
      'twitter': `https://twitter.com/intent/tweet?text=Hola%20amigos!%20Les%20comparto%20esta%20nota%20que%20me%20pareció%20muy%20interesante&url=${encodeURIComponent(url)}`,
      'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, 
      'whatsapp': `whatsapp://send?text=Hola%20amigos!%20Les%20comparto%20esta%20nota%20que%20me%20pareció%20muy%20interesante%20${encodeURIComponent(url)}`
    };
    
    window.open(shareUrl[network], '_blank');
  };

  return (
    <Flex mt={4} justifyContent="center">
      <IconButton 
        aria-label="Share on Twitter" 
        icon={<FaTwitter />} 
        onClick={() => shareOn('twitter', `${window.location.origin}/?notaid=${notaid}`)} 
        mr={2}
      />
      <IconButton 
        aria-label="Share on Facebook" 
        icon={<FaFacebook />} 
        onClick={() => shareOn('facebook', `${window.location.origin}/?notaid=${notaid}`)} 
        mr={2}
      />
      <IconButton 
        aria-label="Share on LinkedIn" 
        icon={<FaLinkedin />} 
        onClick={() => shareOn('linkedin', `${window.location.origin}/?notaid=${notaid}`)} 
        mr={2}
      />
      <IconButton 
        aria-label="Share on WhatsApp" 
        icon={<FaWhatsapp />} 
        onClick={() => shareOn('whatsapp', `${window.location.origin}/?notaid=${notaid}`)} 
      />
      <IconButton 
        aria-label="Copy Link" 
        icon={hasCopied ? <span>✓</span> : <span>🔗</span>} // Convertimos las cadenas en elementos React
        onClick={onCopy} 
        ml={2}
      />
    </Flex>
  );
};

export default ShareLinks;