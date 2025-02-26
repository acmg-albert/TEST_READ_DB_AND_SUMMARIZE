@echo off
echo 正在创建仓库备份...
git clone --mirror . repo-backup.git
cd repo-backup.git

echo 下载 BFG 工具...
powershell -Command "Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar' -OutFile '../bfg.jar'"

echo 使用 BFG 清理历史...
java -jar ../bfg.jar --replace-text ../replacements.txt

echo 清理和优化仓库...
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo 强制推送更改...
git push --force

cd ..
echo 清理完成！ 