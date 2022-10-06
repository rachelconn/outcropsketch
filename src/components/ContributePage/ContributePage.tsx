import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';

// TODO: expand on how to contact, add upload?

const ContributePage: React.FC<RouteComponentProps> = () => {
  return (
    <StandardPage>
      <Article.Header>How to Contribute</Article.Header>
      <Article.Paragraph>
        The Outcrop Sketch project aims to: (1) develop machine learning tools to automatically interpret outcrop images;
        and (2) provide a community tool for labeling outcrop images.
        There are several ways in which you can help us to achieve these aims.
      </Article.Paragraph>
      <Article.Subheader>Contribute outcrop photos!</Article.Subheader>
      <Article.Paragraph>
        To train machine learning algorithms, we require a large dataset of outcrop images, and we would be delighted if you were willing to contribute images.
        We need photos of:
      </Article.Paragraph>
      <Article.List>
        <Article.ListItem>
          Any sedimentary structure! Please send us photos of planar laminated deposits, cross-laminated deposits, convoluted beds, graded beds, massive beds, and more!
        </Article.ListItem>
        <Article.ListItem>
          Sedimentary structures at various scale levels! Photos can be of sedimentary structures at the scale of a few centimeters (perhaps a nice close-up of ripple laminations) to the scale of tens of meters (perhaps large eolian cross-bedding).
          As long as the sedimentary structure is visible, we can use the image!
        </Article.ListItem>
      </Article.List>
      <Article.Paragraph>
        If you have images and you are unsure whether they are useful, feel free to drop us an email at XXXXXXXXXXXXXXX.
        The more diverse our dataset is, the better the machine learning tool will be!
      </Article.Paragraph>
      <Article.Subheader>Give us your feedback on our labeling tool!</Article.Subheader>
      <Article.Paragraph>
        Outcrop Sketch is an easy-to-use labeling tool (try it and see!) and has the potential to facilitate research in the sedimentology community and beyond.
        To maximize the benefits to the community, we would appreciate your feedback on the Outcrop Sketch interface.
        Please let us know what you think of the tool via XXXXXXXXXXX, and whether you have any suggestions for improvement.
      </Article.Paragraph>
      <Article.Subheader>Label outcrop photos!</Article.Subheader>
      <Article.Paragraph>
        Even better than contributing photos, it would also be great if you could label photos.
        You can use our labeling tool to annotate your own photos, and send them to us at XXXXXXXXXXXX.
      </Article.Paragraph>
    </StandardPage>
  );
};

export default ContributePage;
