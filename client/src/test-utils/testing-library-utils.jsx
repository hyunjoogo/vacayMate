import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import QueryClientConfig from "../QueryClientConfig.tsx";

const renderRecoil = (ui, options) =>
  render(ui, { wrapper: QueryClientConfig, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { renderRecoil as render };
