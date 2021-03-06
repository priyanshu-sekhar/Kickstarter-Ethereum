import React from "react";
import Layout from "../../components/Layout";
import Campaign from '../../ethereum/campaign'
import {Button, Card, Grid} from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import {Link} from '../../routes';

function showCampaign(props) {
    const {minimumContribution, balance, requestsCount, approversCount, manager, address} = props;

    function renderCards() {
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests',
                style: {
                    overflowWrap: 'break-word'
                }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from campaign. Requests must be approved by approvers'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have donated to the campaign'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'Balance is the money campaign has left to spend'
            }
        ];

        return (
            <Card.Group items={items}/>
        )
    }

    return (
        <Layout>
            <h3>Campaign Show</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>
                        {renderCards()}
                    </Grid.Column>

                    <Grid.Column width={6}>
                        <ContributeForm address={address}/>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <Link route={`/campaigns/${address}/requests`}>
                            <a>
                                <Button primary>
                                    View Requests
                                </Button>
                            </a>
                        </Link>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Layout>
    );
}

export async function getServerSideProps(props) {
    const {address} = props.query;
    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    return {
        props: {
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address
        }
    }
}

export default showCampaign;