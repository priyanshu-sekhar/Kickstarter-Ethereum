import React, {useState} from "react";
import Layout from "../../../components/Layout";
import Campaign from '../../../ethereum/campaign';
import web3 from "../../../ethereum/web3";
import {Button, Form, Input, Message} from "semantic-ui-react";
import {Router, Link} from '../../../routes';

function newRequests({address}) {
    const  [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const  [recipient, setRecipient] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setErrMsg('');

        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({
                from: accounts[0]
            });

        } catch (err) {
            setErrMsg(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <Link route={`/campaigns/${address}/requests`}>
                <a>
                    Back
                </a>
            </Link>
            <h3>Create a Request</h3>

            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        value={description}
                        onChange={event => setDescription(event.target.value)}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input
                        label={"ether"}
                        labelPosition={"right"}
                        value={value}
                        onChange={event => setValue(event.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Recipient</label>

                    <Input
                        value={recipient}
                        onChange={event => setRecipient(event.target.value)}
                    />
                </Form.Field>

                <Message
                    error
                    header={"Error!"}
                    content={errMsg}
                />

                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </Layout>
    )
}

export function getServerSideProps(props) {
    const {address} = props.query;

    return {
        props: {
            address
        }
    }
}

export default newRequests;