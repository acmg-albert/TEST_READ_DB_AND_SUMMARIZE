@echo off
cd repo-backup.git
java -jar ../bfg.jar --replace-text ../replacements.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force 