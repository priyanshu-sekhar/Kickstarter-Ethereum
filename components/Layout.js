import React from "react";
import Header from "./Header";
import {Container} from "semantic-ui-react";
import Head from "next/head";

export default (props) => {
  return (
      <Container>
          <Head>
              <link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" /><link href="https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" rel="stylesheet" />
          </Head>

          <Header/>
          {props.children}
      </Container>
  )
};