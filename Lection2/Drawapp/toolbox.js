function Toolbox(){
    this.tools = [];
    this.selectedTool = null;
    
    let toolbarItemClick = () => {
        //clear all element
        let items = selectAll(".sideBarItem");
        for (let i = 0; i < items.length; i++)
            items[i].style('border', '0');
        
        let toolName = this.id().split('sideBarItem')[0];
        this.selectTool(toolName);
    };
    
    let addToolIcon = (icon, name) => {
        let sideBarItem = createDiv("<img src='" + icon + "'>");
        sideBarItem.class("sideBarItem");
        sideBarItem.id(name + "sideBarItem");
        sideBarItem.parent("sideBar");
        sideBarItem.mouseClicked(toolbarItemClick);
    };
    
    this.selectTool = (toolName) => {
        for(let i = 0; i < this.tools.length; i++)
        {
            if (this.tools[i].name == toolName)
            {
                if(this.selectedTool != null && this.selectedTool.hasOwnProperty("unselectTool"))
                {
                    this.selectedTool.unselectTool();
                }
            }
            this.selectedTool = this.tools[i];
            select("#" + toolName + "sideBarItem").style("border: 2px solid blue");
        }
    };
    
    this.addTool = (tool) => {
        if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name"))
            console.error("Wrong object tool! Make surre tool have 'name' and 'icon'");
        else
        {
            this.tools.push(tool);
            addToolIcon(tool.icon, name);
            if (this.selectedTool == null)
                this.selectedTool(tool.name);
        }
    };
}