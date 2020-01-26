import * as React from "react";
import {
  Container as ContainerTemplate,
  Segment,
  Statistic,
  Grid,
  Header
} from "semantic-ui-react";
import { SupernodeManagerClient } from "../proto/generated/supernode_grpc_web_pb";
import {
  SupernodeManagerListArgs,
  SupernodeManaged
} from "../proto/generated/supernode_pb";
import { Error } from "grpc-web";
import styled from "@emotion/styled";

const Container = styled(ContainerTemplate)`
  padding-top: 1rem !important;
`;

export default ({ endpoint }: { endpoint: string }) => {
  const client = new SupernodeManagerClient(endpoint);
  const [supernodes, setSupernodes] = React.useState<SupernodeManaged[]>(null);
  const [error, setError] = React.useState<Error>(null);

  React.useEffect(() => {
    const request = new SupernodeManagerListArgs();

    client.list(request, {}, (err, res) => {
      if (err) {
        setError(err);

        return;
      }

      setSupernodes(res.getSupernodesmanagedList());
    });
  }, []);

  return (
    <Container>
      <Header as="h1">Supernodes</Header>
      {error && (
        <Segment inverted color="red">
          {error.message}
        </Segment>
      )}
      {supernodes &&
        supernodes.map((supernode, index) => (
          <Segment key={index}>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <Statistic>
                    <Statistic.Value>
                      {supernode.getListenport()}
                    </Statistic.Value>
                    <Statistic.Label>Listen Port</Statistic.Label>
                  </Statistic>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Statistic>
                    <Statistic.Value>
                      {supernode.getManagementport()}
                    </Statistic.Value>
                    <Statistic.Label>Management Port</Statistic.Label>
                  </Statistic>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        ))}
    </Container>
  );
};
