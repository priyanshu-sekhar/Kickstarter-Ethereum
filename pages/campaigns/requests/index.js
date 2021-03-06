import React from "react";
import Layout from "../../../components/Layout";
import {Link} from '../../../routes';
import {Button, Table} from "semantic-ui-react";
import Campaign from '../../../ethereum/campaign';
import RequestRow from "../../../components/RequestRow";

function showRequests({address, requests, requestCount, approversCount}) {
    const {Header, Row, HeaderCell, Body} = Table;

    function renderRows() {
        return JSON.parse(requests).map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={address}
                    approversCount={approversCount}
                />
            );
        })
    }

    return (
        <Layout>
            <h3>Requests</h3>

            <Link route={`/campaigns/${address}/requests/new`}>
                <a>
                    <Button primary floated={"right"} style={styles.requestButtonStyle}>
                        Add Request
                    </Button>
                </a>
            </Link>

            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>ApprovalCount</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>

                <Body>
                    {renderRows()}
                </Body>
            </Table>

            <div>Found {requestCount} requests.</div>
        </Layout>
    );
}

export async function getServerSideProps(props) {
    const {address} = props.query;
    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call();
        })
    );
    console.log(requests);

    return {
        props: {
            address,
            requests: JSON.stringify(requests),
            requestCount,
            approversCount
        }
    };
}

const styles = {
    requestButtonStyle: {
        marginBottom: 10
    }
}

export default showRequests;