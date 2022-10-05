import * as React from 'react';
import Article from '../common/Article';
import StandardPage from '../common/StandardPage/StandardPage';
import PermianMesaSandstone from '../../images/permian-cedar-mesa-sandstone.png';
import CrossBeddingExamples from '../../images/cross-bedding-examples.png';

const permianMesaSandstoneCaption = 'Sedimentary outcrop of the Permian Cedar Mesa Sandstone (Utah, USA; Ute, Pueblos, and Diné Bikéyah lands) showing abundant sedimentary layering and cross-strata that were deposited by windblown sands in a semi-arid environment; outcrop is ~80 m high.';
const crossBeddingExamplesCaption = 'Example cross bedding - deposits from dunes migrating along an ancient river bed - from the Upper Cretaceous Castlegate Sandstone (Utah, USA; Ute and Southern Paiute lands). Measurements of the size and orientation of these features can be used to reconstruct river flow conditions on ancient landscapes. Figure from Lyster et al., 2022';

const LandingPage: React.FC = () => {
  return (
    <StandardPage>
      <Article.Header>Welcome to Outcrop Sketch!</Article.Header>
      <Article.Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Article.Paragraph>
      <Article.Header>About the Project</Article.Header>
      <Article.Paragraph>
        We’re asking for your help to label key features in photos of sedimentary outcrops.
        Using the Outcrop Sketch tool, you can map areas that show important sedimentary structures, sedimentary surfaces, and non-geological things like people and plants.
        These labels will be used to train computer algorithms to “see” like sedimentary geologists and identify patterns and features in outcrops.
      </Article.Paragraph>
      <Article.Paragraph>
        The Outcrop Sketch project aims to: (1) develop machine learning tools to automatically interpret outcrop images; and (2) provide a community tool for labeling outcrop images.
        There are several ways in which you can help us to achieve these aims.
        Check out our "Contribute" page to learn more about helping our project.
      </Article.Paragraph>
      <Article.Header>Why is this Important?</Article.Header>
      <Article.Paragraph>
        Sedimentary geologists identify key features of outcrops to interpret ancient environments.
        These “sedimentary structures” are signatures of processes that occurred on land or underwater in different settings.
        Identifying these features allows us to reconstruct paleoenvironmental conditions with accuracy and nuance.
      </Article.Paragraph>
      <Article.Image src={PermianMesaSandstone} caption={permianMesaSandstoneCaption} />
      <Article.Paragraph>
        Additionally, certain features, such as cross-strata, record specific environmental conditions, such as the direction of wind patterns or speed of flows in rivers.
        Measuring these features provides important insight into how the surface of Earth and other planets, like Mars, were sculpted by wind, water, and life.
      </Article.Paragraph>
      <Article.Image src={CrossBeddingExamples} caption={crossBeddingExamplesCaption} />
      <Article.Paragraph>
        Field geologists make observations and record measurements of these features, but the process is time-consuming and field trips can be expensive and are not always accessible.
        To help with this, the Outcrop Sketch project aims to develop machine-learning tools for automatically identifying important sedimentary structures from outcrop photos.  
      </Article.Paragraph>
    </StandardPage>
  );
};

export default LandingPage;
