import {
    createGlobalStyle
} from "styled-components";

const GlobalStyle = createGlobalStyle`

@font-face {
  font-family: Ubuntu Mono;
  src: url("/fonts/UbuntuMono-Regular.ttf");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: Ubuntu Mono;
  src: url("/fonts/UbuntuMono-Italic.ttf");
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: Ubuntu Mono;
  src: url("/fonts/UbuntuMono-Bold.ttf");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: Ubuntu Mono;
  src: url("/fonts/UbuntuMono-BoldItalic.ttf");
  font-weight: 700;
  font-style: italic;
}

  *, *::before, *::after {
    box-sizing: border-box;
    /* border-width: 0; */
    /* border-style: solid; */
    /* border-color: currentColor; */
  }

  * {
    font-family: Ubuntu Mono, "Helvetica", "Arial", sans-serif;
  }

  body {
    font-family: Ubuntu Mono, "Helvetica", "Arial", sans-serif;
    line-height: 1.5;
  }

  h2, p {
    margin: 0;
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  svg {
    display: block;
    shape-rendering: auto;
    text-rendering: optimizeLegibility;
  }

  .container {
    margin-left: auto;
    margin-right: auto;
    max-width: 768px;
    padding-bottom: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    /* color: rgba(55, 65, 81, 1); */
    width: 100%;
  }

 

  @media screen and (max-width: 800px) {     
    .ant-picker-panel-container .ant-picker-panels {
      width: 100vw;
      overflow-x: scroll;
    }
  }

  .ant-space-item input:focus {
    outline:none !important;
    outline-width: 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }

  .only-pc {
    display: block;
    @media screen and (max-width: 800px) {
      display: none;
    }
  }

  .only-mobile {
    display: none;
    @media screen and (max-width: 800px) {
      display: block;
    }
  }

  .ant-radio-checked .ant-radio-inner{
  border-color: black !important ;
}

.ant-radio-checked .ant-radio-inner:after{
  background-color: black;
}

.ant-radio:hover .ant-radio-inner {
  border-color: black ;
}
`;

export default GlobalStyle;