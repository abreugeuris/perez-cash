import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Users, Phone, MapPin, IdCard } from "lucide-react";
import { toast } from "sonner";
import {
  fetchSenders,
  deleteSender,
  clearSendersError,
} from "@/store/slices/sendersSlice";
import SenderFormModal from "@/components/modals/SenderFormModal.jsx";
import DataListPage from "@/components/DataListPage";
import { CardBody, Button } from "@/styles/components";
import {
  SearchBar,
  RemitenteCard,
  RemitenteRow,
  RemitenteInfo,
  RemitenteName,
  RemitenteMeta,
  Actions,
  EmptyState,
} from "./styles/sendersStyled";

export default function Senders() {
  const dispatch = useDispatch();
  const {
    items: senders,
    status,
    deleting,
  } = useSelector((state) => state.senders);
  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.role === "owner";

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchSenders());
    return () => dispatch(clearSendersError());
  }, [dispatch, status]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return senders;
    return senders.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        (s.id_document ?? "").toLowerCase().includes(q) ||
        (s.address ?? "").toLowerCase().includes(q),
    );
  }, [senders, search]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);
  const openEdit = useCallback((s) => {
    setEditing(s);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditing(null);
  }, []);

  const handleDelete = async (id) => {
    if (pendingDelete === id) {
      const result = await dispatch(deleteSender(id));
      if (deleteSender.fulfilled.match(result)) {
        toast.success("Sender deleted");
      } else {
        toast.error(result.payload?.message ?? "Error deleting sender");
      }
      setPendingDelete(null);
    } else {
      setPendingDelete(id);
      toast("Delete sender?", {
        description: "Click the icon again to confirm.",
        action: { label: "Cancel", onClick: () => setPendingDelete(null) },
      });
    }
  };

  return (
    <>
      <DataListPage
        title="Gestión de Remitentes"
        subtitle={`${filtered.length} remitente${filtered.length !== 1 ? "s" : ""} registrado${filtered.length !== 1 ? "s" : ""}`}
        actionLabel="Nuevo Remitente"
        onAction={openCreate}
        searchPlaceholder="Buscar por nombre, teléfono o cédula…"
        searchValue={search}
        onSearchChange={setSearch}
        SearchBarComponent={SearchBar}
        loading={status === "loading"}
        loadingText="Cargando remitentes…"
        isEmpty={filtered.length === 0}
        EmptyStateComponent={EmptyState}
        emptyIcon={Users}
        emptyTitle={search ? "Sin resultados" : "No hay remitentes"}
        emptyDescription={
          search
            ? "Intenta con otros términos de búsqueda."
            : "Agrega tu primer remitente para comenzar."
        }
        emptyActionLabel={!search ? "Nuevo Remitente" : undefined}
        onEmptyAction={openCreate}
      >
        {filtered.map((s) => (
          <RemitenteCard key={s.id}>
            <CardBody>
              <RemitenteRow>
                <RemitenteInfo>
                  <RemitenteName>{s.name}</RemitenteName>
                  <RemitenteMeta>
                    <span>
                      <IdCard size={12} /> {s.id_document}
                    </span>
                    <span>
                      <Phone size={12} /> {s.phone}
                    </span>
                    {s.address && (
                      <span>
                        <MapPin size={12} /> {s.address}
                      </span>
                    )}
                  </RemitenteMeta>
                </RemitenteInfo>
                <Actions>
                  <Button
                    $variant="ghost"
                    $size="sm"
                    onClick={() => openEdit(s)}
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Button>
                  {isOwner && (
                    <Button
                      $variant={
                        pendingDelete === s.id ? "destructive" : "ghost"
                      }
                      $size="sm"
                      onClick={() => handleDelete(s.id)}
                      disabled={deleting}
                      title={
                        pendingDelete === s.id ? "Confirm delete" : "Delete"
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </Actions>
              </RemitenteRow>
            </CardBody>
          </RemitenteCard>
        ))}
      </DataListPage>

      <SenderFormModal
        open={modalOpen}
        editing={editing}
        onClose={closeModal}
      />
    </>
  );
}
