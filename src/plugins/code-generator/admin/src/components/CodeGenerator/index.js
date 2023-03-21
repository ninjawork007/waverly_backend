import React, { Component } from "react";
import axios from "axios";
// import { CSVLink } from 'react-csv'
import { CSVLink } from "react-csv/lib";

import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { Button } from "@strapi/design-system/Button";

import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import {
  Layout,
  GridLayout,
  BaseHeaderLayout,
  ContentLayout,
} from "@strapi/design-system/Layout";
import {
  Field,
  FieldLabel,
  FieldHint,
  FieldError,
  FieldInput,
  FieldAction,
} from "@strapi/design-system/Field";
import { Stack } from "@strapi/design-system/Stack";
import { Divider } from "@strapi/design-system/Divider";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { numberOfCodes: "", codes: null, isGenerating: false };
  }

  handleSubmit = (event) => {
    let _this = this;
    this.setState({isGenerating: true})
    axios
      .post(`/api/product-codes/generate`, {
        numberOfCodes: this.state.numberOfCodes,
      })
      .then(
        (response) => {
          _this.setState({ codes: response.data, isGenerating: false });
        },
        (error) => {
          console.log(error);
        }
      );
    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ numberOfCodes: event.target.value });
  };

  render() {
    return (
      <Box background="neutral100">
        <Layout>
          <BaseHeaderLayout
            title="Code Generator"
            subtitle="Enter the amount of codes you want to generate. After codes are created, you can export the codes as a CSV file."
            as="h2"
          />
          <ContentLayout>
            <form onSubmit={this.handleSubmit}>
              <Field name="email">
                <FieldLabel>Enter Number of Codes</FieldLabel>

                <Stack spacing={5} horizontal={true}>
                  <FieldInput
                    type="number"
                    placeholder="Enter number"
                    value={this.state.numberOfCodes}
                    onChange={this.onChange}
                  />
                  <Button type="submit">Generate Codes</Button>
                </Stack>
              </Field>
            </form>
            {
              this.state.isGenerating ? <Typography>Generating codes. Please wait as this may take a while if you are generating thousands of codes...</Typography> : null
            }
            <Box padding={8}>
              <Divider />
            </Box>
            <div id="download-csv">
              {this.state.codes && (
                <div>
                  <CSVLink data={this.state.codes}>
                    <Button variant="success">Export CSV</Button>
                  </CSVLink>

                  <GridLayout>
                    {this.state.codes.map((code) => (
                      <Box
                        padding={4}
                        hasRadius
                        background="neutral0"
                        key={`box-${code.id}`}
                        shadow="tableShadow"
                      >
                        <Typography>{code.pin}</Typography>
                      </Box>
                    ))}
                  </GridLayout>
                </div>
              )}
            </div>
          </ContentLayout>
        </Layout>
      </Box>
    );
  }
}
export default App;
