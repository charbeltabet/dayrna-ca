import { createContext } from "react";

interface HomeContextProps {
  homePageData: any;
}

const HomeContext = createContext<HomeContextProps>({
  homePageData: {}
});

export default HomeContext;