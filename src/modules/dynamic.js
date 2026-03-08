import path from 'path';
import { fileURLToPath,pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dynamic = async () => {

 const args = process.argv.slice(2);
 const pluginName = args[0];
 
 if (!pluginName) {
   console.log("Plugin not found");
   process.exit(1);
  }

  try {
    const module = await import('./plugins/' + pluginName + '.js');
    
    if (typeof module.run !== 'function') {
      console.log("Plugin not found");
      process.exit(1);
    }
    
    const result = module.run();
    console.log(result);

  } catch (err) {
    console.log("Plugin not found");
    process.exit(1);
  }
  
};

await dynamic();
