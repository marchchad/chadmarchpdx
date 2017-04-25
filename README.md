This repo houses the code to power http://www.chadmarchpdx.com

# Development Tools

* [MySql Workbench](http://dev.mysql.com/downloads/workbench/)
* [Visual Studio Code](https://code.visualstudio.com/Download)
* [Git Bash](https://git-scm.com/downloads) _Optional_
* [RedHat Client tools](https://developers.openshift.com/managing-your-applications/client-tools.html)

## Remote connection
To connect to the deployed MySQL instance, enable port forwarding through using `rhc port-forward -a <app name>` and connect
using the information found in the information shown via `rhc app show <app name>`.