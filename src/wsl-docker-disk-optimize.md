# Windows Pro でのWSL版Dockerディスク逼迫の最適化

Cドライブの容量が逼迫した状態。

![](https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202501/wsl-docker-disk-optimize-1.png)

`C:\Users\hatano.yuuta\AppData\Local\Docker\wsl\disk`にあるDocker用のディスクイメージを最適化する。Windows Pro版である必要があるが、`Optimize-VHD -Path .\docker_data.vhdx -Mode full`で最適化。

```sh
PS C:\Users\hatano.yuuta\AppData\Local\Docker\wsl\disk> ls

    Directory: C:\Users\hatano.yuuta\AppData\Local\Docker\wsl\disk

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          12/26/2024 11:15 PM    96271859712 docker_data.vhdx

PS C:\Users\hatano.yuuta\AppData\Local\Docker\wsl\disk> Optimize-VHD -Path .\docker_data.vhdx -Mode full
```

容量が開放されて次のように空き容量がちょっと増えた。

![](https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202501/wsl-docker-disk-optimize-2.png)
