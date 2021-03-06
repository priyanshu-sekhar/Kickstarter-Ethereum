import React, {useState} from "react";
import Layout from "../../components/Layout";
import {Button, Form, Input, Message} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Router} from '../../routes';

function newCampaign() {
    const [minContribution,setMinContribution] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(minContribution)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/');
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <h1>Create a Campaign</h1>

            <Form onSubmit={onSubmit} error={!!errorMsg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        label={"wei"}
                        labelPosition={"right"}
                        value={minContribution}
                        onChange={event => setMinContribution(event.target.value)}
                    />
                </Form.Field>

                <Message
                    error
                    header={"Oops!"}
                    content={errorMsg}
                />

                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    );
}

export default newCampaign;