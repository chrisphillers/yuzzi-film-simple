'use client';
import { AboutUsNav, FaQ, SubmitForm } from '@/lib/data';
import {
  Box,
  Text,
  Paragraph,
  Anchor,
  Nav,
  Carousel as GrommetCarousel,
  ResponsiveContext,
  Layer,
  Heading,
  Button,
  Page,
  Form,
  TextInput,
  FormField,
} from 'grommet';
import { Close } from 'grommet-icons';
import Image from 'next/image';
import { useContext, useState } from 'react';

export const Copy = ({ content }: { content: string[] }) => {
  return (
    <Box margin={{ top: 'small' }} fill>
      {content.map((para) => (
        <Paragraph key={para} fill={true}>
          {para}
        </Paragraph>
      ))}
    </Box>
  );
};

export const Contact = () => (
  <Box align="center">
    <Text weight="bold">CONTACT</Text>
    <Anchor href={'mailto:HELLO@YUZZI.COM'} weight="light" size="medium">
      HELLO@YUZZI.COM
    </Anchor>
  </Box>
);

export const Carousel = () => (
  <Box width="large" overflow="hidden" align="center">
    <GrommetCarousel fill controls={false} play={3000}>
      <Image height="400" width="800" objectFit="cover" alt="test" src="/yuzzi-test.png" />
      <Image height="400" width="800" objectFit="cover" alt="test" src="/yuzzi-test.png" />
      <Image height="400" width="800" objectFit="cover" alt="test" src="/yuzzi-test.png" />
      {/* <GrommetImage fit="cover" src="/yuzzi-test.png" />
      <GrommetImage fit="cover" src="/yuzzi-test.png" />
      <GrommetImage fit="cover" src="/yuzzi-test.png" /> */}
    </GrommetCarousel>
  </Box>
);

export const AboutNav: React.FC<{ aboutUsNav: AboutUsNav[] }> = ({ aboutUsNav }) => {
  const size = useContext(ResponsiveContext);
  const [selectedNav, setSelectedNav] = useState<AboutUsNav | null>(null);

  return (
    <>
      <Nav align="center" direction={size === 'small' ? 'column' : 'row'} alignSelf="center">
        {aboutUsNav.map((nav) => (
          <Anchor
            key={nav.navTitle}
            label={nav.navTitle}
            size="medium"
            weight="normal"
            onClick={() => setSelectedNav(nav)}
          />
        ))}
      </Nav>
      {selectedNav && (
        <AboutUsModal onClose={() => setSelectedNav(null)} aboutUsModalContent={selectedNav} />
      )}
    </>
  );
};
interface AboutUsModalProps {
  onClose: () => void;
  aboutUsModalContent: AboutUsNav;
}

const AboutUsModal: React.FC<AboutUsModalProps> = ({ onClose, aboutUsModalContent }) => {
  const { navTitle, type, content } = aboutUsModalContent;

  return (
    <Layer full animation="fadeIn" animate={true} onEsc={onClose}>
      <Box fill direction="column" pad={{ horizontal: 'medium', vertical: 'medium' }}>
        <Box direction="row" justify="between" align="center" pad={{ bottom: 'medium' }}>
          <Box flex />
          <Heading level={2} margin="none" textAlign="center">
            {navTitle}
          </Heading>
          <Box flex align="end">
            <Button plain icon={<Close size="medium" />} onClick={onClose} />
          </Box>
        </Box>

        <Box overflow="auto" flex pad={{ vertical: 'medium' }} align="center">
          <Box width="large">
            <AboutUsModalBlock type={type} content={content} />
          </Box>
        </Box>
      </Box>
    </Layer>
  );
};

interface AboutUsModalBlockProps {
  type: 'form' | 'faq' | 'text';
  content: string[] | FaQ[] | SubmitForm[];
}

const AboutUsModalBlock: React.FC<AboutUsModalBlockProps> = ({ type, content }) => {
  switch (type) {
    case 'faq':
      return <FAQ content={content as FaQ[]} />;
    case 'form':
      return <FilmSubmissionForm content={content as SubmitForm[]} />;
    case 'text':
      return (
        <Box pad={{ vertical: 'medium' }} align="center">
          {content.map((para) => (
            <Paragraph key={`${para}`} fill>
              {para}
            </Paragraph>
          ))}
        </Box>
      );
    default:
      return null;
  }
};

interface FAQProps {
  content: FaQ[];
}

const FAQ: React.FC<FAQProps> = ({ content }) => {
  if (!content || !Array.isArray(content)) return null;

  return (
    <Page kind="wide" gap="medium">
      {content.map((faqContent) => (
        <>
          <Paragraph key={faqContent.question} fill>
            <Text weight="bold">{faqContent.question}</Text>
          </Paragraph>
          <Paragraph>
            <Text>{faqContent.answer}</Text>
          </Paragraph>
        </>
      ))}
    </Page>
  );
};

export interface FilmSubmissionFormProps {
  content: SubmitForm[];
}

export const FilmSubmissionForm: React.FC<FilmSubmissionFormProps> = ({ content }) => {
  const [value, setValue] = useState({ name: 'a', email: 'b' });

  if (!content) return null;

  return (
    <Box pad={{ vertical: 'medium' }} overflow="auto" gap={'large'}>
      <Paragraph fill>
        We love watching the films you send. We consider films of all genres and formats. Please
        keep in mind that we only respond to those submissions that we decide to pursue.
      </Paragraph>
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onSubmit={({ value: nextValue }) => console.log(nextValue)}
      >
        {content.map(({ fieldType, title }) => {
          // if (fieldType === 'text') {
          //   return <TextInput key={title} name={title}></TextInput>;
          // }
          return (
            <FormField
              margin={{ bottom: 'medium' }}
              fontWeight={'light'}
              key={title}
              htmlFor={fieldType}
              name={title}
              required
            >
              <TextInput
                size="medium"
                // fontWeight=""
                aria-required
                id={title}
                name={title}
                // value={`${title.toUpperCase}`}
                placeholder={title.toUpperCase}
                value={title || ''}
              />
            </FormField>
          );
        })}
      </Form>
      <Anchor
        weight="light"
        size="medium"
        alignSelf="center"
        type="submit"
        label="SUBMIT"
        primary
      />
    </Box>
  );
};
