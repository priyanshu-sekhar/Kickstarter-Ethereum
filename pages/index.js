import React from 'react';
import {Card, Button} from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import {Link} from '../routes';

function App({campaigns}) {
    function renderCampaigns() {
        const items = campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items}/>
    }

    return (
        <Layout>
            <h3>Open Campaigns</h3>

            <Link route={"/campaigns/new"}>
                <a>
                    <Button
                        content={"Create Campaign"}
                        icon={"add circle"}
                        primary={true}
                        floated={"right"}
                    />
                </a>
            </Link>
            {renderCampaigns()}
        </Layout>
    );
}

export async function getStaticProps() {
    const campaigns = await  factory.methods.getDeployedCampaigns().call();

    return {
        props: {campaigns}
    }
}

export default App;