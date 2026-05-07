declare module "virtual:assets-manifest" {
  interface AssetEntry {
    name: string;
    url: string;
    label: string;
  }
  const assets: AssetEntry[];
  export default assets;
}