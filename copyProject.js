const fs = require('fs');
const shelljs = require('shelljs');
const path = require('path');
const { logger } = require('./utils');

const srcProjectPath = '/Users/cfans/Documents/SrcProject';
const targetProjectPath = '/Users/cfans/Documents/TargetProject';
const srcProjectCodePath = `${srcProjectPath}/${srcProjectPath.split('/').pop()}`;
const targetProjectCodePath = `${targetProjectPath}/${targetProjectPath.split('/').pop()}`;
const srcPodfilePath = `${srcProjectPath}/Podfile`;
const targetPodfilePath = `${targetProjectPath}/Podfile`;


function main() {

    //1.删除Main.StoryBoard
    shelljs.exec(`rm -rf ${path.join(targetProjectCodePath, 'Base.lproj', 'Main.storyboard')}`);

    //2.判断是否有Podfile，有就拷贝Podfile，并修改Podfile配置项目
    if (fs.existsSync(srcPodfilePath)) {
        shelljs.exec(`cp -rf ${srcPodfilePath} ${targetPodfilePath}`);
        shelljs.exec(`cp -rf ${path.join(srcProjectPath, 'Pods')} ${path.join(targetProjectPath, 'Pods')}`);
        let podFile = fs.readFileSync(targetPodfilePath, 'utf8');
        podFile = podFile.replace(/target '.*' do/mg, `target '${targetProjectPath.split('/').pop()}' do`);
        fs.writeFileSync(targetPodfilePath, podFile);
    }

    //3.拷贝源文件
    shelljs.exec(`cp -rf ${srcProjectCodePath}/* ${targetProjectCodePath}`);


    logger.log('3s后执行pod install，并打开目标项目');
    setTimeout(() => {
        shelljs.exec(`cd ${targetProjectPath} && pod install && open ${targetProjectPath.split('/').pop()}.xcworkspace`);
    }, 3000);
}

main();


