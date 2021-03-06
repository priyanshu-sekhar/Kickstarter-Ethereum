import React, {useState} from "react";
import {Button, Table} from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from '../ethereum/campaign';
import {Router} from '../routes';

function RequestRow({id, request, approversCount, address}) {
    const {Row, Cell} = Table;
    const {description, value, recipient, approvalCount, complete} = request;
    const readyToFinalize = approvalCount > approversCount/2;
    const [loading, setLoading] = useState(false);
    const [finalizing, setFinalizing] = useState(false);

    async function onApprove() {
        setLoading(true);

        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();

        try {
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            });

            Router.replaceRoute(`/campaigns/${address}/requests`);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    async function onFinalize() {
        setFinalizing(true);

        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(id).send({
            from: accounts[0]
        });

        try {
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            });

            Router.replaceRoute(`/campaigns/${address}/requests`);
        } catch (err) {

        } finally {
            setFinalizing(false);
        }
    }

    return (
        <Row disabled={complete} positive={readyToFinalize && !complete}>
            <Cell>{id}</Cell>
            <Cell>{description}</Cell>
            <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
            <Cell>{recipient}</Cell>
            <Cell>
                {approvalCount}/{approversCount}
            </Cell>
            <Cell>
                {complete ? null : (
                    <Button color={"green"} basic onClick={onApprove} loading={loading}>
                        Approve
                    </Button>
                )}
            </Cell>
            <Cell>
                {complete ? null : (
                    <Button color={"teal"} basic onClick={onFinalize} loading={finalizing}>
                        Finalize
                    </Button>
                )}
            </Cell>
        </Row>
    )
}

export default RequestRow;