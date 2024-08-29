# 大量のファイルが含まれるディレクトリのリストアッププログラム

Githubにアップするほどのものでもないので。

```go
package main 

import ( 
    "fmt" 
    "io/ioutil" 
    "path/filepath" 
) 

var num int 

func main(){ 
    fmt.Println("[Output range] [Directory path]") 
    var dir string 
    fmt.Scanf("%d %s",&num,&dir) 
    fmt.Println(dir) 
    Dirwalk(dir) 
} 

func Dirwalk(dir string){ 
    files, err := ioutil.ReadDir(dir) 
    if err != nil { 
        panic(err) 
    } 
    
    counter := 0 
    
    for _, file := range files { 
        if file.IsDir(){ 
            // ディレクトリ 
            Dirwalk(filepath.Join(dir, file.Name())) 
        } else { 
            counter++ 
        } 
    } 
    
    if counter > num{ 
        fmt.Println(counter," ",dir) 
    } 
}
```