import { AppProps } from "next/app";
import 'antd/dist/antd.css'
import {DatePicker} from "antd"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Component {...pageProps} />
  );
};

export default App;
