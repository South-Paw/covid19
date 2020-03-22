import 'styled-components';

import { system } from '../../src/components/ui/Theme/system';

type ThemeInterface = typeof system;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {}
}
