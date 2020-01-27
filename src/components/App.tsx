import * as React from "react";
import { SupernodeManagerClient } from "../proto/generated/supernode_grpc_web_pb";
import {
  SupernodeManagerListArgs,
  SupernodeManaged,
  SupernodeManagedId
} from "../proto/generated/supernode_pb";
import { Error } from "grpc-web";
import { Heading, Card, Text, Flex, Box, Button } from "rebass";
import { FaAssistiveListeningSystems } from "react-icons/fa";
import { AiOutlineControl } from "react-icons/ai";
import { MdDelete, MdRefresh } from "react-icons/md";

export default ({ endpoint }: { endpoint: string }) => {
  const client = new SupernodeManagerClient(endpoint);
  const [supernodes, setSupernodes] = React.useState<SupernodeManaged[]>(null);
  const [error, setError] = React.useState<Error>(null);

  const refetch = () => {
    const request = new SupernodeManagerListArgs();

    client.list(request, {}, (err, res) =>
      err
        ? setError(err)
        : setSupernodes(
            res
              .getSupernodesmanagedList()
              .sort((a, b) => a.getListenport() - b.getListenport())
          )
    );
  };

  React.useEffect(() => refetch(), []);

  return (
    <>
      {error && (
        <Card
          sx={{
            borderRadius: 4
          }}
        >
          Error: {error}
        </Card>
      )}

      <Flex justifyContent="space-between" alignItems="center">
        <Heading sx={{ my: 3 }}>Supernodes</Heading>
        <Button onClick={refetch}>
          <Flex alignItems="center" sx={{ minHeight: 24 }}>
            <MdRefresh />
          </Flex>
        </Button>
      </Flex>

      {supernodes &&
        supernodes.map((supernode, index) => (
          <Supernode
            listenPort={supernode.getListenport()}
            managementPort={supernode.getManagementport()}
            onDelete={() => {
              const request = new SupernodeManagedId();
              request.setId(supernode.getId());

              client.delete(request, {}, (err, _) =>
                err ? setError(err) : refetch()
              );
            }}
            key={index}
          />
        ))}
    </>
  );
};

const Supernode = ({
  listenPort,
  managementPort,
  onDelete,
  ...otherProps
}: {
  listenPort: number;
  managementPort: number;
  onDelete: () => any;
}) => (
  <Card
    sx={{
      position: "relative",
      mb: 3,
      borderRadius: 4
    }}
    {...otherProps}
  >
    <Button
      onClick={onDelete}
      sx={{
        display: "flex",
        position: "absolute",
        right: 0,
        top: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 0,
        background: "red"
      }}
    >
      <Flex alignItems="center" sx={{ minHeight: 24 }}>
        <MdDelete />
      </Flex>
    </Button>
    <Box
      sx={{
        display: "grid",
        gridGap: 3,
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
      }}
    >
      <Box width={1} p={3}>
        <Statistic
          title="Listen port"
          icon={<FaAssistiveListeningSystems />}
          content={listenPort}
        />
      </Box>
      <Box width={1} p={3}>
        <Statistic
          title="Management Port"
          icon={<AiOutlineControl />}
          content={managementPort}
        />
      </Box>
    </Box>
  </Card>
);

const Statistic = ({
  title,
  icon,
  content
}: {
  title: any;
  icon?: any;
  content: any;
}) => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center">
    <Text fontWeight="bold" fontSize={[6]}>
      {content}
    </Text>
    <Flex justifyContent="center" alignItems="center">
      {icon}
      <Text sx={{ textTransform: "uppercase", ml: icon && 1 }}>{title}</Text>
    </Flex>
  </Flex>
);
