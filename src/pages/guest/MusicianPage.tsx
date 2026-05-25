import { Calendar } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Badge } from "../../components/ui";
import { formatDate } from "../../utils/helpers";

export default function MusicianPage() {
  const { params, navigate, musicians, members, ensembles, compositions } = useApp();
  const musician = musicians.find(m => m.id === params.id);

  if (!musician) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Музыкант не найден</div>
  );

  const musicianMemberships = members.filter(m => m.musicianId === musician.id);
  const musicianCompositions = compositions.filter(c => c.compositorId === musician.id);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: photo + basic info */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border overflow-hidden">
            <div className="aspect-square overflow-hidden bg-secondary">
              <img src={musician.photo} alt={`${musician.firstName} ${musician.lastName}`}
                className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight">
                {musician.firstName} {musician.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <Calendar size={13} className="text-primary/60" />
                {formatDate(musician.birthDate)}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {musician.instruments.map(inst => (
                  <Badge key={inst} variant="gold">{inst}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Bio */}
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Биография</h2>
            <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-5" />
            <p className="text-muted-foreground leading-relaxed">{musician.bio}</p>
          </div>

          {/* Ensembles */}
          {musicianMemberships.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Участие в ансамблях</h2>
              <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-5" />
              <div className="flex flex-col gap-3">
                {musicianMemberships.map(m => {
                  const ensemble = ensembles.find(e => e.id === m.ensembleId);
                  if (!ensemble) return null;
                  return (
                    <div key={m.id} className="bg-card border border-border p-4 flex items-center gap-4">
                      <div className="w-12 h-12 overflow-hidden flex-shrink-0 bg-secondary">
                        <img src={ensemble.photo} alt={ensemble.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <button onClick={() => navigate("ensemble", { id: ensemble.id })}
                          className="font-medium text-foreground hover:text-primary transition-colors text-sm">
                          {ensemble.name}
                        </button>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {m.role}{m.instrument ? ` · ${m.instrument}` : ""}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-xs flex-shrink-0">
                        с {m.from}{m.to ? ` по ${m.to}` : " — наст. вр."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compositions */}
          {musicianCompositions.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Авторские произведения</h2>
              <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mb-5" />
              <div className="border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Название</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Длительность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {musicianCompositions.map(comp => (
                      <tr key={comp.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 text-foreground">{comp.title}</td>
                        <td className="px-4 py-3 text-muted-foreground font-data text-xs">{comp.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
