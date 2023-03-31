import React, { Component } from "react";
import axios from "axios";
// import { CSVLink } from 'react-csv'
import { CSVLink } from "react-csv/lib";
import ReactPaginate from 'react-paginate';
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import { Button } from "@strapi/design-system/Button";
import papaparse from 'papaparse'
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
import styles from './Code.modules.css'
const itemsPerPage = 1000
const allowedExtensions = ["csv"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], erorr: "", file: "", codes: null, isGenerating: false, itemOffset: 0 };
  }

  handleFileChange = (e) => {
    e.preventDefault()
    this.setState({ error: "" });
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        this.setState({ error: "Please input a csv file" });
        return;
      }

      this.setState({ file: inputFile });

    }
  };

  handleParse = async (e) => {
    e.preventDefault()
    if (!this.state.file) return this.setState({ error: "Enter a valid file" });
    this.setState({ isGenerating: true })

    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = papaparse.parse(target.result, { header: true });
      const parsedData = csv?.data;
      try {
        const { data } = await axios.post(`/api/product-codes/upload`, { codes: JSON.stringify(parsedData) })
        this.setState({ codes: data })
        this.setState({ isGenerating: false })
      } catch (error) {
        console.log(error)
        this.setState({ isGenerating: false })
      }
    };
    reader.readAsText(this.state.file);

  }
  render() {
    let endOffset
    let currentItems
    let pageCount = 0;
    if (this.state.codes) {
      endOffset = this.state.itemOffset + itemsPerPage;
      currentItems = this.state.codes.slice(this.state.itemOffset, endOffset);
      pageCount = Math.ceil(this.state.codes.length / itemsPerPage);
    }

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % this.state.codes.length;
      this.setState({ itemOffset: newOffset });
    };
    return (
      <Box background="neutral100">
        <Layout>
          <BaseHeaderLayout
            title="Code Uploader"
            subtitle="Upload code CSV, we will verify the codes and update in DB"
            as="h2"
          />
          <ContentLayout>
            <form onSubmit={this.handleParse}>
              <Field name="email">
                <FieldLabel>Enter Number of Codes</FieldLabel>

                <Stack spacing={5} horizontal={true}>
                  <FieldInput
                    type="file"
                    placeholder="Upload csv"
                    // value={this.state.numberOfCodes}
                    onChange={this.handleFileChange}
                    accept='.csv'
                  />
                  {" "}
                  <Button type="submit">Upload CSV</Button>
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
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
                previousClassName={styles.pageItem}
                previousLinkClassName={styles.pageLink}
                nextClassName={styles.pageItem}
                nextLinkClassName={styles.pageLink}
                breakLabel="..."
                breakClassName={styles.pageItem}
                breakLinkClassName={styles.pageLink}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
              />
              {this.state.codes && (
                <div>
                  <CSVLink data={this.state.codes}>
                    <Button variant="success">Export CSV</Button>
                  </CSVLink>

                  <GridLayout>
                    {currentItems.map((code) => (
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
