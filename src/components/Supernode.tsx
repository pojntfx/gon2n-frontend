import * as React from "react";
import { Grid, Segment, Statistic, Button } from "semantic-ui-react";
import styled from "@emotion/styled";

const Header = styled.div`
  display: flex;
  justify-content: end;
`;

export default ({
  id,
  listenPort,
  managementPort,
  ...otherProps
}: {
  id: string;
  listenPort: number;
  managementPort: number;
}) => {
  return (
    <Segment {...otherProps}>
      <Header>
        <Button color="red" icon="delete"></Button>
      </Header>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Statistic>
              <Statistic.Value>{listenPort}</Statistic.Value>
              <Statistic.Label>Listen Port</Statistic.Label>
            </Statistic>
          </Grid.Column>
          <Grid.Column textAlign="center">
            <Statistic>
              <Statistic.Value>{managementPort}</Statistic.Value>
              <Statistic.Label>Management Port</Statistic.Label>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};
