# Golangでprotocol buffer

protoファイル
```proto
syntax = "proto3";
package pb;

message Graph {
  repeated Edge edge = 1;
}

// Our address book file is just one of these.
message Edge {
  int64 edge_id = 1;
  int64 from = 2;
  int64 to = 3;
  double cost = 4;
  repeated int64 point_id = 5;
}
```

## WSL上で次を実行

```sh
sudo apt install golang-goprotobuf-dev
export GOBIN=$GOPATH/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT:$GOPATH:$GOBIN
protoc --go_out=./ ./graph.proto
```