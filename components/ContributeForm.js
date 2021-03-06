import React, {useState} from "react";
import {Button, Form, Input, Message} from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from "../ethereum/web3";
import {Router} from '../routes';

function ContributeForm({address}) {
    const [contribution, setContribution] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setErrMsg('');

        const campaign = Campaign(address);

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(contribution, 'ether')
            });

            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            setErrMsg(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={onSubmit} error={!!errMsg}>
            <Form.Field>
                <label>
                    Amount to Contribute
                </label>

                <Input
                    label={"ether"}
                    labelPosition={"right"}
                    value={contribution}
                    onChange={event => setContribution(event.target.value)}
                />
            </Form.Field>

            <Message
                error
                header={"Error!"}
                content={errMsg}
            />

            <Button
                primary={true}
                loading={loading}
            >
                Contribute!
            </Button>
        </Form>
    )
}

export default ContributeForm;