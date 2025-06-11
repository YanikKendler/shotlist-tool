# Contribution
my project, everyone can contribute, no pay, maybe free months of pro, submit issue instead

## How to
clone repo, submit PR

## "Weird" code choices
I made some choices in this code that may seem weird or unnecessary, but i had my thoughts behind them.

### Duplicated code for shot and scene attributes
It would be possible to use the same entity or interface or component for both shot and scene attributes. I did not do that for 2 main reasons.
**potential future changes**
If I ever want to add an attribute type only to the shots or want to store more or different data in only shot attributes, if it were the same objects id have to do massive refactoring or add a "isShot" bolean and have if's everywhere. While it may seem to be the cleaner option, merging scene and shot attributes is not a good idea.
**cleaner edge cases**
Especially in the rendering process its much nicer to have sperate components to reference and style. In the backend its much cleaner to just create a Object and be done with it as well as just switch-casing the object, getting its type and being done with it. All the logic in everything related to shot attributes applies all the time.

### No sidebar component
It may seem like an obvious choice to create a sidebar component that can be used everywhere but because the sidebar is so different between the dashboard and the shotlist this would just result in a huge if else that would return two different mockups for the different pages. It would potentially make sense to create a ShotlistSidebar to break up the complexity.

### Not bi-directional quarkus class properties with attributes
Long story short: it breaks the backend.
Long story: I tried this for a straight week and some of the data just would not be displayed even though the relation was there in the db. I also ran into [this](https://stackoverflow.com/questions/79550566/quarkus-hibernate-orm-creates-flawed-associative-table-when-two-entities-with-o) fun issue which i managed to work around. I brought this up to a teacher and they practically told me "quarkus relations just suck" so i removed the bi directional relation and tadaaa. It worked, this does result in way more queries and its really ugly code at times where i have to do a whole lot of where clauses instead of dot notations but i figure quarkus would do the same behind the scenes so it doesnt really matter.