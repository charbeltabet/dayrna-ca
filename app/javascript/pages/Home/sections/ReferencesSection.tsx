import { HomeSectionLayout } from '../../../components/HomeSectionLayout';
import NavigationsDisplay from '../../Reference/NavigationsDisplay';

export default function ReferencesSection() {
  return (
    <HomeSectionLayout.Container>
      <HomeSectionLayout.Header>Reference</HomeSectionLayout.Header>
      <HomeSectionLayout.Content>
        <NavigationsDisplay />
      </HomeSectionLayout.Content>
    </HomeSectionLayout.Container>
  )
}
