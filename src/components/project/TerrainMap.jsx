import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { MapPin, Loader2, Search, Upload, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function parseGoogleCoords(input) {
  // Accepts: "-15.123456, -47.654321" or "15°07'24.4\"S 47°39'17.6\"W" etc.
  const simple = input.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (simple) return [parseFloat(simple[1]), parseFloat(simple[2])];
  return null;
}

export default function TerrainMap({ project }) {
  const [coords, setCoords] = useState(
    project.google_coords ? parseGoogleCoords(project.google_coords) : null
  );
  const [coordInput, setCoordInput] = useState(project.google_coords || "");
  const [locationInput, setLocationInput] = useState(project.location || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [kmzUrl, setKmzUrl] = useState(project.kmz_file || null);
  const [kmzName, setKmzName] = useState(project.kmz_file_name || null);
  const [uploadingKmz, setUploadingKmz] = useState(false);

  useEffect(() => {
    // If google_coords set, parse directly
    if (project.google_coords) {
      const parsed = parseGoogleCoords(project.google_coords);
      if (parsed) { setCoords(parsed); return; }
    }
    // Otherwise geocode from location
    if (project.location && !coords) geocode(project.location);
  }, []);

  const geocode = async (location) => {
    setLoading(true);
    setError(null);
    const query = encodeURIComponent(location + ", Brasil");
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      const c = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      setCoords(c);
      setCoordInput(`${c[0].toFixed(6)}, ${c[1].toFixed(6)}`);
    } else {
      setError("Localização não encontrada. Insira as coordenadas manualmente.");
    }
    setLoading(false);
  };

  const applyCoords = async () => {
    const parsed = parseGoogleCoords(coordInput);
    if (!parsed) { setError("Formato inválido. Use: -15.123456, -47.654321"); return; }
    setError(null);
    setCoords(parsed);
    await base44.entities.Project.update(project.id, { google_coords: coordInput });
  };

  const searchLocation = () => {
    if (locationInput.trim()) geocode(locationInput.trim());
  };

  const handleKmzUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingKmz(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setKmzUrl(file_url);
    setKmzName(file.name);
    await base44.entities.Project.update(project.id, { kmz_file: file_url, kmz_file_name: file.name });
    setUploadingKmz(false);
  };

  const removeKmz = async () => {
    setKmzUrl(null);
    setKmzName(null);
    await base44.entities.Project.update(project.id, { kmz_file: null, kmz_file_name: null });
  };

  const radiusM = project.total_area ? Math.sqrt(project.total_area / Math.PI) : 200;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-xl font-display font-semibold">Localização do Terreno</h3>
          <p className="text-sm text-muted-foreground">Defina a localização por endereço ou coordenadas do Google Maps.</p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Search by location */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Buscar por Endereço / Cidade</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Ribeirão Preto, SP"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            />
            <Button variant="outline" size="icon" onClick={searchLocation} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Manual coordinates */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Coordenadas Google Maps</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ex: -21.170887, -47.810081"
              value={coordInput}
              onChange={(e) => setCoordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCoords()}
            />
            <Button variant="outline" size="icon" onClick={applyCoords}>
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Cole as coordenadas direto do Google Maps (clique direito → copiar coordenadas).</p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Map */}
      {loading && (
        <div className="flex items-center justify-center h-80 bg-muted rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {coords && !loading && (
        <div className="rounded-xl overflow-hidden border border-border shadow-md" style={{ height: 420 }}>
          <MapContainer center={coords} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords}>
              <Popup><strong>{project.name}</strong><br />{coords[0].toFixed(6)}, {coords[1].toFixed(6)}</Popup>
            </Marker>
            <Circle
              center={coords}
              radius={radiusM}
              pathOptions={{ color: "hsl(220,70%,45%)", fillColor: "hsl(220,70%,45%)", fillOpacity: 0.15, weight: 2 }}
            />
          </MapContainer>
        </div>
      )}

      {!coords && !loading && (
        <div className="flex items-center justify-center h-48 bg-muted/50 rounded-xl border border-dashed border-border">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Busque por endereço ou insira as coordenadas acima.</p>
          </div>
        </div>
      )}

      {/* Stats */}
      {coords && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Coordenadas", value: `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}` },
            { label: "Área Total", value: project.total_area ? `${project.total_area.toLocaleString()} m²` : "-" },
            { label: "Perímetro", value: project.perimeter ? `${project.perimeter.toLocaleString()} m` : "-" },
            { label: "Testada", value: project.main_frontage ? `${project.main_frontage} m` : "-" },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* KMZ Upload */}
      <div className="border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <img src="https://www.gstatic.com/earth/icon/google_earth_16x16.png" alt="Google Earth" className="h-4 w-4" onError={(e) => e.target.style.display='none'} />
          </div>
          <div>
            <p className="text-sm font-semibold">Arquivo KMZ / KML — Google Earth</p>
            <p className="text-xs text-muted-foreground">Faça upload do polígono do terreno para visualização no Google Earth.</p>
          </div>
        </div>

        {kmzUrl ? (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{kmzName || "Arquivo KMZ"}</p>
              <p className="text-xs text-muted-foreground">Arquivo enviado com sucesso</p>
            </div>
            <a href={kmzUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir
              </Button>
            </a>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={removeKmz}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
            <Upload className={`h-5 w-5 ${uploadingKmz ? "animate-bounce text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm text-muted-foreground">
              {uploadingKmz ? "Enviando arquivo..." : "Clique para enviar arquivo KMZ ou KML"}
            </span>
            <input type="file" accept=".kmz,.kml" className="hidden" disabled={uploadingKmz} onChange={handleKmzUpload} />
          </label>
        )}
      </div>
    </div>
  );
}