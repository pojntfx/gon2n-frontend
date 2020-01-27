import * as React from "react";
import { SupernodeManagerClient } from "../proto/generated/supernode_grpc_web_pb";
import {
  SupernodeManagerListArgs,
  SupernodeManaged
} from "../proto/generated/supernode_pb";
import { Error } from "grpc-web";
import { Heading, Card, Text, Flex, Box } from "rebass";

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
    <>
      <Heading sx={{ my: 3 }}>Supernodes</Heading>

      {supernodes &&
        supernodes.map((supernode, index) => (
          <Supernode
            listenPort={supernode.getListenport()}
            managementPort={supernode.getManagementport()}
            key={index}
          />
        ))}
    </>
  );
};

const Supernode = ({
  listenPort,
  managementPort,
  ...otherProps
}: {
  listenPort: number;
  managementPort: number;
}) => (
  <Card {...otherProps}>
    <Box
      sx={{
        display: "grid",
        gridGap: 3,
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
      }}
    >
      <Box width={1} p={3}>
        <Statistic title="Listen Port" content={listenPort} />
      </Box>
      <Box width={1} p={3}>
        <Statistic title="Management Port" content={managementPort} />
      </Box>
    </Box>
  </Card>
);

const Statistic = ({ title, content }: { title: string; content: any }) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center">
    <Text fontWeight="bold" fontSize={[6]}>
      {content}
    </Text>
    <Text sx={{ textTransform: "uppercase" }}>{title}</Text>
  </Flex>
);
